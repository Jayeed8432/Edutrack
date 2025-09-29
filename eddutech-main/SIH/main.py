import os
import cv2
import numpy as np
from deepface import DeepFace
from datetime import datetime
import pandas as pd

STUDENT_FACES_DIR = 'student_faces'
ATTENDANCE_DIR = 'attendance_excels'
os.makedirs(ATTENDANCE_DIR, exist_ok=True)

# Step 1: Encode all student faces
student_encodings = []
student_names = []
for filename in os.listdir(STUDENT_FACES_DIR):
    if filename.lower().endswith(('.jpg', '.jpeg', '.png')):
        path = os.path.join(STUDENT_FACES_DIR, filename)
        img = cv2.imread(path)
        if img is not None:
            # DeepFace expects RGB
            img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            result = DeepFace.represent(img_rgb, model_name='VGG-Face', enforce_detection=False)
            embedding = None
            if isinstance(result, list) and len(result) > 0 and isinstance(result[0], dict) and 'embedding' in result[0]:
                embedding = np.array(result[0]['embedding'])  # type: ignore[index]
            elif isinstance(result, dict) and 'embedding' in result:
                embedding = np.array(result['embedding'])  # type: ignore[index]
            if embedding is not None:
                student_encodings.append(embedding)
                student_names.append(os.path.splitext(filename)[0])
                print(f"Loaded face for {filename}")
            else:
                print(f"No face found in {filename}")
        else:
            print(f"Could not read {filename}")

# Step 2: Attendance function
def mark_attendance(class_image_path):
    # Save detected faces for inspection
    DETECTED_FACES_DIR = 'detected_faces_from_class'
    os.makedirs(DETECTED_FACES_DIR, exist_ok=True)
    # Remove old detected faces
    for f in os.listdir(DETECTED_FACES_DIR):
        try:
            os.remove(os.path.join(DETECTED_FACES_DIR, f))
        except Exception:
            pass
    img = cv2.imread(class_image_path)
    if img is None:
        print("Could not read class image.")
        # Still generate an all-absent Excel
        attendance = [{'Name': name, 'Status': 'Absent'} for name in student_names]
        date_str = datetime.now().strftime('%Y-%m-%d')
        excel_path = os.path.join(ATTENDANCE_DIR, f'attendance_{date_str}.xlsx')
        df = pd.DataFrame(attendance)
        df.to_excel(excel_path, index=False)
        print(f'Attendance saved to {excel_path}')
        return attendance
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    faces = DeepFace.extract_faces(img_rgb, detector_backend='opencv', enforce_detection=False)
    print(f"Number of faces detected in class image: {len(faces)}")
    present = set()
    matched_students = set()
    all_best_dists = []
    face_best_matches = []  # Collect best matches for threshold testing
    SIDE_BY_SIDE_DIR = 'side_by_side_debug'
    os.makedirs(SIDE_BY_SIDE_DIR, exist_ok=True)
    for i, face_obj in enumerate(faces):
        if not isinstance(face_obj, dict) or 'face' not in face_obj:
            print(f"Face object {i+1} is invalid.")
            continue
        face_img = face_obj['face']
        # Save detected face for inspection
        face_img_to_save = None
        if isinstance(face_img, np.ndarray):
            face_save_path = os.path.join(DETECTED_FACES_DIR, f'detected_face_{i+1}.jpg')
            if face_img.dtype == np.float64:
                face_img_to_save = np.clip(face_img * 255, 0, 255).astype(np.uint8)
            elif face_img.dtype == np.uint8:
                face_img_to_save = face_img
            else:
                face_img_to_save = face_img.astype(np.uint8)
            if len(face_img_to_save.shape) == 3 and face_img_to_save.shape[2] == 3:
                cv2.imwrite(face_save_path, cv2.cvtColor(face_img_to_save, cv2.COLOR_RGB2BGR))
            else:
                cv2.imwrite(face_save_path, face_img_to_save)
        else:
            print(f"Face image {i+1} is not a valid numpy array.")
            continue
        face_emb_result = DeepFace.represent(face_img, model_name='VGG-Face', enforce_detection=False)
        face_emb = None
        if isinstance(face_emb_result, list) and len(face_emb_result) > 0 and isinstance(face_emb_result[0], dict) and 'embedding' in face_emb_result[0]:
            face_emb = np.array(face_emb_result[0]['embedding'])  # type: ignore[index]
        elif isinstance(face_emb_result, dict) and 'embedding' in face_emb_result:
            face_emb = np.array(face_emb_result['embedding'])  # type: ignore[index]
        if face_emb is not None:
            # Calculate both cosine similarity and Euclidean distance
            cos_sims = []
            l2_dists = []
            for j, stud_emb in enumerate(student_encodings):
                norm_face = face_emb / np.linalg.norm(face_emb)
                norm_stud = stud_emb / np.linalg.norm(stud_emb)
                cos_sims.append(np.dot(norm_face, norm_stud))
                l2_dists.append(np.linalg.norm(face_emb - stud_emb))
                # Save side-by-side image for visual inspection
                try:
                    student_img_path = os.path.join(STUDENT_FACES_DIR, f'{student_names[j]}.jpeg')
                    if not os.path.exists(student_img_path):
                        student_img_path = os.path.join(STUDENT_FACES_DIR, f'{student_names[j]}.jpg')
                    if not os.path.exists(student_img_path):
                        student_img_path = os.path.join(STUDENT_FACES_DIR, f'{student_names[j]}.png')
                    if os.path.exists(student_img_path) and face_img_to_save is not None:
                        stud_img = cv2.imread(student_img_path)
                        if stud_img is not None:
                            # Resize both to same height
                            h = min(stud_img.shape[0], face_img_to_save.shape[0])
                            stud_img_resized = cv2.resize(stud_img, (int(stud_img.shape[1] * h / stud_img.shape[0]), h))
                            face_img_resized = cv2.resize(face_img_to_save, (int(face_img_to_save.shape[1] * h / face_img_to_save.shape[0]), h))
                            side_by_side = cv2.hconcat([stud_img_resized, face_img_resized])
                            cv2.imwrite(os.path.join(SIDE_BY_SIDE_DIR, f'face{i+1}_vs_{student_names[j]}.jpg'), side_by_side)
                except Exception as e:
                    print(f"Error saving side-by-side for face {i+1} and {student_names[j]}: {e}")
            best_idx = int(np.argmin(l2_dists)) if l2_dists else -1
            best_dist = l2_dists[best_idx] if l2_dists else float('inf')
            best_cos = cos_sims[best_idx] if cos_sims and best_idx != -1 else -1
            all_best_dists.append(best_dist)
            face_best_matches.append((best_idx, best_dist, best_cos))  # Store best match info
            # Print all scores for debugging
            for j, (name, cos, dist) in enumerate(zip(student_names, cos_sims, l2_dists)):
                print(f"Face {i+1}: {name} | Cosine: {cos:.3f} | L2: {dist:.3f}")
            # Use L2 distance for matching
            l2_threshold = 1.2  # VGG-Face embeddings are usually normalized, so threshold is much lower
            print(f"Face {i+1}: Best L2 distance: {best_dist:.3f} (suggested threshold: {l2_threshold})")
            if best_idx != -1 and best_dist < l2_threshold:
                best_name = student_names[best_idx]
                if best_name not in matched_students:
                    present.add(best_name)
                    matched_students.add(best_name)
                print(f"Face {i+1}: Best match is {best_name} with L2 distance {best_dist:.3f} (cosine {best_cos:.3f})")
            else:
                print(f"Face {i+1}: No good match found. Best L2 distance: {best_dist:.3f}")
        else:
            print(f"No embedding for detected face {i+1}")

    # Threshold sweep for best attendance
    best_count = 0
    best_threshold = 1.2
    for test_thresh in np.arange(0.8, 2.0, 0.05):
        present = set()
        matched_students = set()
        for idx, dist, _ in face_best_matches:
            if idx != -1 and dist < test_thresh:
                name = student_names[idx]
                if name not in matched_students:
                    present.add(name)
                    matched_students.add(name)
        print(f"Threshold {test_thresh:.2f}: {len(present)} students marked present: {sorted(list(present))}")
        if len(present) > best_count:
            best_count = len(present)
            best_threshold = test_thresh
    print(f"\nBest threshold for max attendance: {best_threshold:.2f} (students marked present: {best_count})")

    # Use the best threshold found
    present = set()
    matched_students = set()
    for best_idx, best_dist, _ in face_best_matches:
        if best_idx != -1 and best_dist < best_threshold:
            best_name = student_names[best_idx]
            if best_name not in matched_students:
                present.add(best_name)
                matched_students.add(best_name)

    # Prepare attendance list
    attendance = []
    for name in student_names:
        status = 'Present' if name in present else 'Absent'
        attendance.append({'Name': name, 'Status': status})
    # Save to Excel
    date_str = datetime.now().strftime('%Y-%m-%d')
    excel_path = os.path.join(ATTENDANCE_DIR, f'attendance_{date_str}.xlsx')
    df = pd.DataFrame(attendance)
    df.to_excel(excel_path, index=False)
    print(f'Attendance saved to {excel_path}')
    return attendance

# Example usage:
result = mark_attendance("C:/Users/prajy/OneDrive/Desktop/WhatsApp Image 2025-09-27 at 21.12.55_6d2cc250.jpg")
print(result)
