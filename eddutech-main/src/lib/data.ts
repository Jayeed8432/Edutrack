import type { User, Class, Attendance } from './types';

export const mockUser: User = {
  uid: 'student123',
  name: 'Alex Doe',
  email: 'alex.doe@example.com',
  role: 'student',
  interests: ['Artificial Intelligence', 'Web Development', 'Data Structures & Algorithms'],
  goals: ['Placement 2026', 'Learn Machine Learning'],
  avatarUrl: 'https://picsum.photos/seed/101/200/200',
};

export const mockTeacher: User = {
    uid: 'teacher456',
    name: 'Dr. Evelyn Reed',
    email: 'e.reed@example.com',
    role: 'teacher',
    interests: [],
    goals: [],
    avatarUrl: 'https://picsum.photos/seed/102/200/200',
};

export const mockClasses: Class[] = [
  {
    classId: 'CS101',
    subject: 'Introduction to Computer Science',
    teacherId: 'teacher456',
    teacherName: 'Dr. Evelyn Reed',
    schedule: { day: 'Monday', startTime: '10:00', endTime: '11:00' },
  },
  {
    classId: 'MA202',
    subject: 'Linear Algebra',
    teacherId: 'teacher789',
    teacherName: 'Dr. Ben Carter',
    schedule: { day: 'Monday', startTime: '11:00', endTime: '12:00' },
  },
  {
    classId: 'PHY150',
    subject: 'Classical Mechanics',
    teacherId: 'teacher101',
    teacherName: 'Dr. Olivia Chen',
    schedule: { day: 'Monday', startTime: '13:00', endTime: '14:00' },
  },
];

export const mockAttendance: Attendance[] = [
    { classId: 'CS101', studentId: 'student01', studentName: 'Alice Johnson', avatarUrl: 'https://picsum.photos/seed/103/40/40', timestamp: new Date(), status: 'present' },
    { classId: 'CS101', studentId: 'student02', studentName: 'Bob Williams', avatarUrl: 'https://picsum.photos/seed/104/40/40', timestamp: new Date(), status: 'present' },
    { classId: 'CS101', studentId: 'student03', studentName: 'Charlie Brown', avatarUrl: 'https://picsum.photos/seed/105/40/40', timestamp: new Date(), status: 'absent' },
    { classId: 'CS101', studentId: 'student04', studentName: 'Diana Miller', avatarUrl: 'https://picsum.photos/seed/106/40/40', timestamp: new Date(), status: 'present' },
];

export const mockUsers: User[] = [
    { uid: 'student01', name: 'Alice Johnson', email: 'alice@example.com', role: 'student', interests: ['AI'], goals: ['Internship'], avatarUrl: 'https://picsum.photos/seed/103/40/40' },
    { uid: 'teacher456', name: 'Dr. Evelyn Reed', email: 'e.reed@example.com', role: 'teacher', interests: [], goals: [], avatarUrl: 'https://picsum.photos/seed/102/40/40' },
    { uid: 'admin001', name: 'Frank White', email: 'frank@example.com', role: 'admin', interests: [], goals: [], avatarUrl: 'https://picsum.photos/seed/107/40/40' },
    ...mockAttendance.map((a, i) => ({
        uid: `${a.studentId}_${i}`,
        name: a.studentName,
        email: `${a.studentName.split(' ')[0].toLowerCase()}@example.com`,
        role: 'student' as const,
        interests: ['Web Dev'],
        goals: ['Placement 2025'],
        avatarUrl: a.avatarUrl,
    }))
];
