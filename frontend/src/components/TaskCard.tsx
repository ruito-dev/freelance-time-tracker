import type { Task } from '../types/task';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: Task['status']) => void;
}

const STATUS_LABELS: Record<Task['status'], string> = {
  todo: '未着手',
  in_progress: '進行中',
  done: '完了',
};

const STATUS_COLORS: Record<Task['status'], string> = {
  todo: 'bg-gray-100 text-gray-800',
  in_progress: 'bg-blue-100 text-blue-800',
  done: 'bg-green-100 text-green-800',
};

const PRIORITY_LABELS: Record<Task['priority'], string> = {
  low: '低',
  medium: '中',
  high: '高',
};

const PRIORITY_COLORS: Record<Task['priority'], string> = {
  low: 'text-gray-600',
  medium: 'text-yellow-600',
  high: 'text-red-600',
};

export const TaskCard = ({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) => {
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onStatusChange(task.id, e.target.value as Task['status']);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const isOverdue = (dueDate: string | null) => {
    if (!dueDate || task.status === 'done') return false;
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {task.project && (
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: task.project.color }}
                title={task.project.name}
              />
            )}
            <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
          </div>
          {task.description && <p className="text-sm text-gray-600 mb-2">{task.description}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <select
          value={task.status}
          onChange={handleStatusChange}
          className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[task.status]}`}
        >
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <span className={`text-xs font-medium ${PRIORITY_COLORS[task.priority]}`}>
          優先度: {PRIORITY_LABELS[task.priority]}
        </span>

        {task.due_date && (
          <span
            className={`text-xs ${
              isOverdue(task.due_date) ? 'text-red-600 font-medium' : 'text-gray-600'
            }`}
          >
            期限: {formatDate(task.due_date)}
            {isOverdue(task.due_date) && ' (期限切れ)'}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
        <button
          onClick={() => onEdit(task)}
          className="text-sm text-indigo-600 hover:text-indigo-800"
        >
          編集
        </button>
        <button
          onClick={() => {
            if (window.confirm('このタスクを削除しますか？')) {
              onDelete(task.id);
            }
          }}
          className="text-sm text-red-600 hover:text-red-800"
        >
          削除
        </button>
      </div>
    </div>
  );
};
