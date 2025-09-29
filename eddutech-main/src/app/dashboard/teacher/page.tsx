'use client';

import { useState } from 'react';
import { ClassSelector } from '@/components/dashboard/teacher/class-selector';
import { QrCodeDisplay } from '@/components/dashboard/teacher/qr-code-display';
import { RealTimeAttendance } from '@/components/dashboard/teacher/real-time-attendance';
import { FaceAttendanceCapture } from '@/components/dashboard/teacher/face-attendance-capture';
import { mockClasses } from '@/lib/data';

export default function TeacherDashboardPage() {
    const [selectedClassId, setSelectedClassId] = useState(mockClasses[0].classId);
    const [attendanceImage, setAttendanceImage] = useState<File | null>(null);
    const [attendanceResult, setAttendanceResult] = useState<{ Name: string; Status: string }[] | null>(null);
    const [attendanceError, setAttendanceError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleImageCaptured = async (file: File) => {
      setAttendanceImage(file);
      setAttendanceResult(null);
      setAttendanceError(null);
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('http://localhost:8000/attendance', {
          method: 'POST',
          body: formData,
        });
        if (!res.ok) throw new Error('Attendance API error');
        const data = await res.json();
        if (data.attendance) {
          setAttendanceResult(data.attendance);
        } else if (data.error) {
          setAttendanceError(data.error);
        } else {
          setAttendanceError('Unknown error');
        }
      } catch (err: any) {
        setAttendanceError(err.message || 'Error connecting to backend');
      } finally {
        setLoading(false);
      }
    };

    return (
      <>
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold md:text-2xl font-headline">Teacher Dashboard</h1>
          <ClassSelector selectedClassId={selectedClassId} setSelectedClassId={setSelectedClassId} />
        </div>
        <FaceAttendanceCapture onImageCaptured={handleImageCaptured} />
        {loading && (<div className="my-2 text-blue-600">Processing attendance...</div>)}
        {attendanceError && (<div className="my-2 text-red-600">{attendanceError}</div>)}
        {attendanceResult && (
          <div className="my-4">
            <h2 className="font-semibold mb-2">Attendance Result</h2>
            <table className="min-w-[300px] border">
              <thead>
                <tr>
                  <th className="border px-2 py-1">Name</th>
                  <th className="border px-2 py-1">Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceResult.map((row, i) => (
                  <tr key={i}>
                    <td className="border px-2 py-1">{row.Name}</td>
                    <td className="border px-2 py-1">{row.Status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
          <QrCodeDisplay classId={selectedClassId} />
          <RealTimeAttendance classId={selectedClassId} />
        </div>
      </>
    );
}
