'use client';

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
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, CheckCircle, Percent } from 'lucide-react';
  
const attendanceData = [
    { subject: 'CS101', attendance: 85 },
    { subject: 'MA202', attendance: 92 },
    { subject: 'PHY150', attendance: 78 },
    { subject: 'ENG210', attendance: 95 },
    { subject: 'BIO110', attendance: 88 },
];
const chartConfig = {
    attendance: { label: 'Attendance', color: 'hsl(var(--primary))' },
};

const taskData = [
    { status: 'Completed', value: 72, fill: 'hsl(var(--chart-1))' },
    { status: 'Pending', value: 28, fill: 'hsl(var(--chart-2))' },
];
const taskConfig = {
    Completed: { label: 'Completed', color: 'hsl(var(--chart-1))' },
    Pending: { label: 'Pending', color: 'hsl(var(--chart-2))' },
};
  
export function AnalyticsCards() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Attendance</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87.5%</div>
            <p className="text-xs text-muted-foreground">+2.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Task Engagement</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">72%</div>
            <p className="text-xs text-muted-foreground">+15% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Productive Day</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Wednesday</div>
            <p className="text-xs text-muted-foreground">Highest task completion rate</p>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
            <CardHeader>
                <CardTitle>Attendance by Subject</CardTitle>
                <CardDescription>Average attendance percentage per subject.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[250px] w-full">
                <BarChart data={attendanceData} accessibilityLayer>
                    <XAxis dataKey="subject" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="attendance" fill="var(--color-attendance)" radius={4} />
                </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Task Completion Status</CardTitle>
                <CardDescription>Overview of suggested tasks.</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
                <ChartContainer config={taskConfig} className="h-[250px] w-full">
                    <PieChart>
                        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                        <Pie data={taskData} dataKey="value" nameKey="status" innerRadius={50}>
                            {taskData.map((entry) => (
                                <Cell key={entry.status} fill={entry.fill} />
                            ))}
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
      </div>
    );
}
