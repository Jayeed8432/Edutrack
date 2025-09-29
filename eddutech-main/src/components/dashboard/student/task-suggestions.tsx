'use client';

import { useState, useTransition } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getTaskSuggestions } from '@/app/actions';
import type { SuggestedTask } from '@/lib/types';
import { mockUser } from '@/lib/data';
import { Lightbulb, Loader2, Tags, Clock, BookCopy } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function TaskSuggestions() {
  const [tasks, setTasks] = useState<SuggestedTask[]>([]);
  const [isPending, startTransition] = useTransition();

  const handleGetSuggestions = () => {
    startTransition(async () => {
      const suggestedTasks = await getTaskSuggestions({
        studentId: mockUser.uid,
        interests: mockUser.interests,
        goals: mockUser.goals,
      });
      setTasks(suggestedTasks);
    });
  };

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="text-accent" />
          <span>Personalized Tasks</span>
        </CardTitle>
        <CardDescription>
          AI-powered task suggestions for your free periods to help you achieve
          your goals.
        </CardDescription>
      </CardHeader>
      <CardContent className="min-h-[200px]">
        {tasks.length > 0 ? (
          <ul className="space-y-4">
            {tasks.map((task, index) => (
              <li key={task.taskId}>
                <div className="grid gap-2">
                    <p className="font-semibold">{task.title}</p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><BookCopy className="h-4 w-4"/> {task.category}</span>
                        <span className="flex items-center gap-1"><Clock className="h-4 w-4"/> {task.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap mt-1">
                        <Tags className="h-4 w-4 text-muted-foreground" />
                        {task.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                            {tag}
                        </Badge>
                        ))}
                    </div>
                </div>
                {index < tasks.length -1 && <Separator className="my-4" />}
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex h-full min-h-[150px] items-center justify-center">
            <p className="text-muted-foreground">
              Click the button to get your personalized tasks.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleGetSuggestions} disabled={isPending}>
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Lightbulb className="mr-2 h-4 w-4" />
          )}
          {isPending ? 'Generating...' : 'Suggest Tasks'}
        </Button>
      </CardFooter>
    </Card>
  );
}
