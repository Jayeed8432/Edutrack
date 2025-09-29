# **App Name**: EduProductivity Hub

## Core Features:

- User Authentication with Roles: Secure Firebase Authentication with roles (Student, Teacher, Admin) and profile creation in Firestore, including name, email, role, interests, and goals.
- QR Code Attendance: Teachers generate QR codes for class attendance. Students scan the QR code, triggering a Cloud Function to write attendance data to Firestore.
- Personalized Task Suggestions: The app uses a tool to check student timetables, detect free periods, and suggests personalized tasks from the 'Tasks' collection based on student interests and goals. This tool relies on Firebase data and Firestore Security Rules.
- Real-time Attendance Display: Display real-time attendance for a class, with functionality available on teacher and admin dashboards.
- User Dashboards: Dedicated dashboards for students (timetable, attendance, task suggestions), teachers (QR generation, attendance view), and admins (reports, user management).

## Style Guidelines:

- Primary color: Deep sky blue (#3498DB) to reflect a sense of trust and stability.
- Background color: Light gray (#ECF0F1), same hue family as the primary, but softly desaturated.
- Accent color: A contrasting shade of orange (#E67E22), which lies 30 degrees to the 'left' of the primary on the color wheel, for important actions.
- Body and headline font: 'PT Sans', a humanist sans-serif that is versatile enough for both headlines and body text.
- Simple, outlined icons for navigation and features.
- Clean and intuitive layout, optimized for quick access to key information.
- Subtle transitions and animations to provide feedback and enhance user experience.