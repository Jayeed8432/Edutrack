'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { mockClasses } from '@/lib/data';
import { Clock, BookUser } from 'lucide-react';

export default function TimetableCard() {
  const [today, setToday] = React.useState('');
  React.useEffect(() => {
    setToday(new Date().toLocaleDateString('en-US', { weekday: 'long' }));
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Schedule</CardTitle>
        <CardDescription>{today}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {mockClasses.map((cls, index) => (
            <li key={cls.classId}>
              <div className="grid gap-1">
                <p className="font-semibold">{cls.subject}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>
                    {cls.schedule.startTime} - {cls.schedule.endTime}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <BookUser className="h-4 w-4" />
                  <span>{cls.teacherName}</span>
                </div>
              </div>
              {index < mockClasses.length - 1 && <Separator className="mt-4" />}
            </li>
          ))}
            <li key="free-period">
              <div className="grid gap-1">
                <p className="font-semibold text-primary">Free Period</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>
                    12:00 - 13:00
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <BookUser className="h-4 w-4" />
                  <span>Time for personal development!</span>
                </div>
              </div>
            </li>
        </ul>
      </CardContent>
    </Card>
  );
}
