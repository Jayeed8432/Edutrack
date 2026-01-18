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
  { status: 'present', value: 80, fill: 'hsl(var(--primary))' },
  { status: 'absent', value: 20, fill: 'hsl(var(--muted))' },
];
const chartConfig = {
    present: { label: 'Present', color: 'hsl(var(--primary))' },
    absent: { label: 'Absent', color: 'hsl(var(--muted))' },
};

export default function AttendanceOverview() {
    const total = React.useMemo(() => {
        return chartData.find(item => item.status === 'present')?.value || 0;
      }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Overview</CardTitle>
        <CardDescription>Your attendance for this semester.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative flex h-[250px] w-full items-center justify-center">
          <ChartContainer config={chartConfig} className="w-full">
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
                cx="50%"
                cy="50%"
                >
                {chartData.map((entry) => (
                    <Cell key={`cell-${entry.status}`} fill={entry.fill} />
                ))}
                </Pie>
            </PieChart>
          </ChartContainer>
          <div className="absolute inset-0 flex items-center justify-center text-center">
            <div className="grid gap-1">
                <div className="text-3xl font-bold tracking-tighter">
                {total}%
                </div>
                <div className="text-sm text-muted-foreground">Attended</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
