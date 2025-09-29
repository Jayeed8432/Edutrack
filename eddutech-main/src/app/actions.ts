'use server';

import { suggestTasks, type SuggestTasksInput } from '@/ai/flows/personalized-task-suggestions';

export async function getTaskSuggestions(input: SuggestTasksInput) {
  try {
    const suggestions = await suggestTasks(input);
    return suggestions.tasks;
  } catch (error) {
    console.error("Error fetching task suggestions:", error);
    return [];
  }
}
