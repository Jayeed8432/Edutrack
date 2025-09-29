'use server';

/**
 * @fileOverview A personalized task suggestion AI agent.
 *
 * - suggestTasks - A function that suggests personalized tasks for students during free periods.
 * - SuggestTasksInput - The input type for the suggestTasks function.
 * - SuggestTasksOutput - The return type for the suggestTasks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTasksInputSchema = z.object({
  studentId: z.string().describe('The ID of the student.'),
  interests: z.array(z.string()).describe('The interests of the student.'),
  goals: z.array(z.string()).describe('The goals of the student.'),
});
export type SuggestTasksInput = z.infer<typeof SuggestTasksInputSchema>;

const SuggestTasksOutputSchema = z.object({
  tasks: z.array(
    z.object({
      taskId: z.string().describe('The ID of the task.'),
      title: z.string().describe('The title of the task.'),
      category: z.string().describe('The category of the task.'),
      tags: z.array(z.string()).describe('The tags associated with the task.'),
      duration: z.string().describe('The estimated duration of the task.'),
    })
  ).describe('A list of personalized tasks for the student.'),
});
export type SuggestTasksOutput = z.infer<typeof SuggestTasksOutputSchema>;

export async function suggestTasks(input: SuggestTasksInput): Promise<SuggestTasksOutput> {
  return suggestTasksFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTasksPrompt',
  input: {schema: SuggestTasksInputSchema},
  output: {schema: SuggestTasksOutputSchema},
  prompt: `You are an AI assistant designed to suggest personalized tasks for students during their free periods.

  Consider the student's interests and goals to recommend tasks that are relevant and helpful.

  Interests: {{interests}}
  Goals: {{goals}}

  Suggest a list of tasks that align with the student's interests and goals. Provide the taskId, title, category, tags, and duration for each task.
  Ensure the tasks are actionable and can be completed within a reasonable timeframe.
  Return the tasks in JSON format:
  {
    "tasks": [
      {
        "taskId": "string",
        "title": "string",
        "category": "academic | career | personal",
        "tags": ["string"],
        "duration": "string"
      }
    ]
  }`,
});

const suggestTasksFlow = ai.defineFlow(
  {
    name: 'suggestTasksFlow',
    inputSchema: SuggestTasksInputSchema,
    outputSchema: SuggestTasksOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
