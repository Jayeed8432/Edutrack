'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { PieChart, Pie, Cell } from 'recharts';

const chartData = [
  { status: 'present', value: 85, fill: 'hsl(var(--primary))' },
  { status: 'absent', value: 15, fill: 'hsl(var(--muted))' },
];
const chartConfig = {
    present: { label: 'Present', color: 'hsl(var(--primary))' },
    absent: { label: 'Absent', color: 'hsl(var(--muted))' },
};

export default function AttendanceOverview() {
    const total = React.useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.value, 0);
      }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Overview</CardTitle>
        <CardDescription>Your attendance for this semester.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <ChartContainer config={chartConfig}>
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="status"
                innerRadius={60}
                strokeWidth={5}
                >
                {chartData.map((entry) => (
                    <Cell key={`cell-${entry.status}`} fill={entry.fill} />
                ))}
                </Pie>
            </PieChart>
          </ChartContainer>
        </div>
        <div className="-mt-24 flex items-center justify-center text-center">
            <div className="grid gap-1">
                <div className="text-3xl font-bold tracking-tighter">
                {total}%
                </div>
                <div className="text-sm text-muted-foreground">Attended</div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
