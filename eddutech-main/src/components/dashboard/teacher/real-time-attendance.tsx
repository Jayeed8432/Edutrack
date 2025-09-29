import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { mockAttendance, mockClasses } from '@/lib/data';
import { Users } from 'lucide-react';
import { useEffect, useState } from 'react';

interface RealTimeAttendanceProps {
    classId: string;
}

export function RealTimeAttendance({ classId }: RealTimeAttendanceProps) {
    const attendanceData = mockAttendance.filter(att => att.classId === classId);
    const selectedClass = mockClasses.find(c => c.classId === classId);

    // Hydration-safe time formatting
    const [clientTimes, setClientTimes] = useState<string[]>([]);
    useEffect(() => {
      // Only run on client, and only if attendanceData is stable
      setClientTimes(
        attendanceData.map(att => {
          // Defensive: handle both Date and string
          if (att.timestamp instanceof Date) {
            return att.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
          } else if (typeof att.timestamp === 'string' || typeof att.timestamp === 'number') {
            const d = new Date(att.timestamp);
            return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
          }
          return '';
        })
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [classId]); // Only update when classId changes, not on every render

    if (!selectedClass) {
        return null; // Or a placeholder
    }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Users />Real-Time Attendance</CardTitle>
        <CardDescription>Showing attendance for {selectedClass.subject}.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Time</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {attendanceData.map((att, idx) => (
                <TableRow key={att.studentId}>
                    <TableCell>
                        <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9" data-ai-hint="student avatar">
                                <AvatarImage src={att.avatarUrl} alt={att.studentName} />
                                <AvatarFallback>{att.studentName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="font-medium">{att.studentName}</div>
                        </div>
                    </TableCell>
                    <TableCell>
                        <Badge variant={att.status === 'present' ? 'default' : 'destructive'} className={att.status === 'present' ? 'bg-green-500/20 text-green-700 border-green-500/30 hover:bg-green-500/30' : ''}>
                            {att.status}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {clientTimes[idx] || ''}
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
