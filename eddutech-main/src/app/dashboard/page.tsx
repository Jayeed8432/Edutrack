import TimetableCard from '@/components/dashboard/student/timetable-card';
import AttendanceOverview from '@/components/dashboard/student/attendance-overview';
import TaskSuggestions from '@/components/dashboard/student/task-suggestions';
import { mockUser } from '@/lib/data';

export default function StudentDashboardPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">
          Welcome, {mockUser.name.split(' ')[0]}!
        </h1>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
        <TimetableCard />
        <AttendanceOverview />
        <TaskSuggestions />
      </div>
    </>
  );
}
