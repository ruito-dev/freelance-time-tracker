export interface Project {
  id: number;
  name: string;
  description: string | null;
  color: string;
  user_id: number;
  tasks_count?: number;
  total_hours?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  color: string;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  color?: string;
}
