import type { Task } from './task';

export interface TimeEntry {
  id: number;
  task_id: number;
  user_id: number;
  started_at: string;
  ended_at: string | null;
  description: string | null;
  duration: number | null;
  created_at: string;
  updated_at: string;
  task: Task;
}

export interface CreateTimeEntryData {
  task_id: number;
  started_at: string;
  ended_at?: string;
  description?: string;
}

export interface UpdateTimeEntryData {
  task_id?: number;
  started_at?: string;
  ended_at?: string;
  description?: string;
}
