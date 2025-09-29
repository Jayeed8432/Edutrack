export type User = {
  uid: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  interests: string[];
  goals: string[];
  avatarUrl: string;
};

export type Class = {
  classId: string;
  subject: string;
  teacherId: string;
  teacherName: string;
  schedule: {
    day: string;
    startTime: string;
    endTime: string;
  };
};

export type Attendance = {
  classId: string;
  studentId: string;
  studentName: string;
  avatarUrl: string;
  timestamp: Date;
  status: 'present' | 'absent';
};

export type SuggestedTask = {
  taskId: string;
  title: string;
  category: string;
  tags: string[];
  duration: string;
};
