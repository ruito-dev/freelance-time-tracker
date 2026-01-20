import { apiClient } from './client';
import type { Project, CreateProjectRequest, UpdateProjectRequest } from '../types/project';

export const projectsApi = {
  // プロジェクト一覧取得
  getProjects: async (): Promise<Project[]> => {
    const response = await apiClient.get<Project[]>('/api/v1/projects');
    return response.data;
  },

  // プロジェクト詳細取得
  getProject: async (id: number): Promise<Project> => {
    const response = await apiClient.get<Project>(`/api/v1/projects/${id}`);
    return response.data;
  },

  // プロジェクト作成
  createProject: async (data: CreateProjectRequest): Promise<Project> => {
    const response = await apiClient.post<Project>('/api/v1/projects', { project: data });
    return response.data;
  },

  // プロジェクト更新
  updateProject: async (id: number, data: UpdateProjectRequest): Promise<Project> => {
    const response = await apiClient.put<Project>(`/api/v1/projects/${id}`, { project: data });
    return response.data;
  },

  // プロジェクト削除
  deleteProject: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/v1/projects/${id}`);
  },
};
