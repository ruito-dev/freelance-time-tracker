import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getTimeEntries,
  getTimeEntry,
  createTimeEntry,
  updateTimeEntry,
  deleteTimeEntry,
} from '../api/timeEntries';
import type { CreateTimeEntryData, UpdateTimeEntryData } from '../types/timeEntry';

interface UseTimeEntriesParams {
  task_id?: number;
  project_id?: number;
  start_date?: string;
  end_date?: string;
}

export const useTimeEntries = (params?: UseTimeEntriesParams) => {
  return useQuery({
    queryKey: ['timeEntries', params],
    queryFn: () => getTimeEntries(params),
  });
};

export const useTimeEntry = (id: number) => {
  return useQuery({
    queryKey: ['timeEntries', id],
    queryFn: () => getTimeEntry(id),
    enabled: !!id,
  });
};

export const useCreateTimeEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTimeEntryData) => createTimeEntry(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeEntries'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useUpdateTimeEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTimeEntryData }) =>
      updateTimeEntry(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeEntries'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useDeleteTimeEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteTimeEntry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeEntries'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};
