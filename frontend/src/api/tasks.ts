import { apiClient } from './client';
import type { Task, CreateTaskData, UpdateTaskData } from '../types/task';

export const getTasks = async (projectId?: number): Promise<Task[]> => {
  const url = projectId ? `/api/v1/projects/${projectId}/tasks` : '/api/v1/tasks';
  const response = await apiClient.get<Task[]>(url);
  return response.data;
};

export const getTask = async (id: number): Promise<Task> => {
  const response = await apiClient.get<Task>(`/api/v1/tasks/${id}`);
  return response.data;
};

export const createTask = async (data: CreateTaskData): Promise<Task> => {
  const response = await apiClient.post<Task>(`/api/v1/projects/${data.project_id}/tasks`, {
    task: data,
  });
  return response.data;
};

export const updateTask = async (id: number, data: UpdateTaskData): Promise<Task> => {
  const response = await apiClient.put<Task>(`/api/v1/tasks/${id}`, {
    task: data,
  });
  return response.data;
};

export const deleteTask = async (id: number): Promise<void> => {
  await apiClient.delete(`/api/v1/tasks/${id}`);
};
