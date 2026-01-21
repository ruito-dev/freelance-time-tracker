import { useState } from 'react';
import { ProjectCard } from '../components/ProjectCard';
import { ProjectFormModal } from '../components/ProjectFormModal';
import { Layout } from '../components/Layout';
import {
  useProjects,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
} from '../hooks/useProjects';
import type { Project } from '../types/project';

export const Projects = () => {
  const { data: projects, isLoading, error } = useProjects();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const handleCreateProject = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleDeleteProject = (id: number) => {
    deleteProject.mutate(id);
  };

  const handleSubmit = (data: { name: string; description: string; color: string }) => {
    if (editingProject) {
      updateProject.mutate(
        { id: editingProject.id, data },
        {
          onSuccess: () => {
            setIsModalOpen(false);
            setEditingProject(null);
          },
        }
      );
    } else {
      createProject.mutate(data, {
        onSuccess: () => {
          setIsModalOpen(false);
        },
      });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">読み込み中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">エラーが発生しました: {error.message}</div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">プロジェクト管理</h1>
        <div className="flex items-center justify-between">
          <p className="text-gray-600">{projects?.length || 0} 件のプロジェクト</p>
          <button
            onClick={handleCreateProject}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            新規プロジェクト
          </button>
        </div>
      </div>

      {projects && projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={handleEditProject}
              onDelete={handleDeleteProject}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">プロジェクトがありません</h3>
          <p className="mt-1 text-sm text-gray-500">新規プロジェクトを作成して始めましょう</p>
          <div className="mt-6">
            <button
              onClick={handleCreateProject}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              新規プロジェクト
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      <ProjectFormModal
        key={editingProject?.id || 'new'}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        project={editingProject}
        isLoading={createProject.isPending || updateProject.isPending}
      />
    </Layout>
  );
};
