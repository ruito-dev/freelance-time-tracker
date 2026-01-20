import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTasks, getTask, createTask, updateTask, deleteTask } from '../api/tasks';
import type { UpdateTaskData } from '../types/task';

export const useTasks = (projectId?: number) => {
  return useQuery({
    queryKey: projectId ? ['tasks', projectId] : ['tasks'],
    queryFn: () => getTasks(projectId),
  });
};

export const useTask = (id: number) => {
  return useQuery({
    queryKey: ['tasks', id],
    queryFn: () => getTask(id),
    enabled: !!id,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    onSuccess: (newTask) => {
      // プロジェクト別のタスク一覧を無効化
      queryClient.invalidateQueries({ queryKey: ['tasks', newTask.project_id] });
      // 全タスク一覧を無効化
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      // プロジェクト一覧を無効化（タスク数が変わるため）
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTaskData }) => updateTask(id, data),
    onSuccess: (updatedTask) => {
      // 個別タスクを無効化
      queryClient.invalidateQueries({ queryKey: ['tasks', updatedTask.id] });
      // プロジェクト別のタスク一覧を無効化
      queryClient.invalidateQueries({ queryKey: ['tasks', updatedTask.project_id] });
      // 全タスク一覧を無効化
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      // すべてのタスク関連のクエリを無効化
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      // プロジェクト一覧を無効化（タスク数が変わるため）
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};
