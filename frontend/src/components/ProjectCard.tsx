import { useNavigate } from 'react-router-dom';
import type { Project } from '../types/project';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: number) => void;
}

export const ProjectCard = ({ project, onEdit, onDelete }: ProjectCardProps) => {
  const navigate = useNavigate();

  const handleDelete = () => {
    if (window.confirm(`「${project.name}」を削除してもよろしいですか？`)) {
      onDelete(project.id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: project.color }}
            aria-label="プロジェクトカラー"
          />
          <h3 className="text-xl font-semibold text-gray-900">{project.name}</h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(project)}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            aria-label="編集"
          >
            編集
          </button>
          <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
            aria-label="削除"
          >
            削除
          </button>
        </div>
      </div>

      {project.description && <p className="text-gray-600 text-sm mb-4">{project.description}</p>}

      <div className="flex items-center gap-4 text-sm text-gray-500">
        <button
          onClick={() => navigate(`/tasks?project=${project.id}`)}
          className="flex items-center gap-1 hover:text-indigo-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <span>{project.tasks_count || 0} タスク</span>
        </button>
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{formatTotalHours(project.total_hours || 0)}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-400">
        作成日: {new Date(project.created_at).toLocaleDateString('ja-JP')}
      </div>
    </div>
  );
};

function formatTotalHours(hours: number): string {
  if (hours === 0) return '0時間';

  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);

  if (minutes === 0) {
    return `${wholeHours}時間`;
  }

  return `${wholeHours}時間${minutes}分`;
}
