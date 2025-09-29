from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import shutil
import os
from main import mark_attendance

app = FastAPI()

# Allow CORS for local frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploaded_class_images"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/attendance")
async def attendance(file: UploadFile = File(...)):
    # Save uploaded file
    file_location = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    # Run attendance
    try:
        attendance_result = mark_attendance(file_location)
        return JSONResponse(content={"attendance": attendance_result})
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
