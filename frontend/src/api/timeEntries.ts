import { apiClient } from './client';
import type { TimeEntry, CreateTimeEntryData, UpdateTimeEntryData } from '../types/timeEntry';

interface GetTimeEntriesParams {
  task_id?: number;
  project_id?: number;
  start_date?: string;
  end_date?: string;
}

export const getTimeEntries = async (params?: GetTimeEntriesParams): Promise<TimeEntry[]> => {
  const response = await apiClient.get<TimeEntry[]>('/api/v1/time_entries', { params });
  return response.data;
};

export const getTimeEntry = async (id: number): Promise<TimeEntry> => {
  const response = await apiClient.get<TimeEntry>(`/api/v1/time_entries/${id}`);
  return response.data;
};

export const createTimeEntry = async (data: CreateTimeEntryData): Promise<TimeEntry> => {
  const response = await apiClient.post<TimeEntry>('/api/v1/time_entries', { time_entry: data });
  return response.data;
};

export const updateTimeEntry = async (id: number, data: UpdateTimeEntryData): Promise<TimeEntry> => {
  const response = await apiClient.patch<TimeEntry>(`/api/v1/time_entries/${id}`, { time_entry: data });
  return response.data;
};

export const deleteTimeEntry = async (id: number): Promise<void> => {
  await apiClient.delete(`/api/v1/time_entries/${id}`);
};
