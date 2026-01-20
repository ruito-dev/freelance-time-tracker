import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { TaskCard } from '../components/TaskCard';
import { TaskFormModal } from '../components/TaskFormModal';
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from '../hooks/useTasks';
import { useProjects } from '../hooks/useProjects';
import { useLogout } from '../hooks/useAuth';
import type { Task } from '../types/task';

export const Tasks = () => {
  const navigate = useNavigate();
  const logout = useLogout();
  const [searchParams, setSearchParams] = useSearchParams();
  const projectIdParam = searchParams.get('project');
  const projectId = projectIdParam ? Number(projectIdParam) : undefined;

  const { data: tasks, isLoading, error } = useTasks(projectId);
  const { data: projects } = useProjects();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [statusFilter, setStatusFilter] = useState<Task['status'] | 'all'>('all');

  const handleLogout = () => {
    logout();
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = (id: number) => {
    deleteTask.mutate(id);
  };

  const handleStatusChange = (id: number, status: Task['status']) => {
    updateTask.mutate({ id, data: { status } });
  };

  const handleSubmit = (data: {
    project_id: number;
    title: string;
    description: string;
    status: Task['status'];
    priority: Task['priority'];
    due_date: string;
  }) => {
    if (editingTask) {
      updateTask.mutate(
        { id: editingTask.id, data },
        {
          onSuccess: () => {
            setIsModalOpen(false);
            setEditingTask(null);
          },
        }
      );
    } else {
      createTask.mutate(data, {
        onSuccess: () => {
          setIsModalOpen(false);
        },
      });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleProjectFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ project: value });
    }
  };

  const filteredTasks = tasks?.filter((task) => {
    if (statusFilter === 'all') return true;
    return task.status === statusFilter;
  });

  const groupedTasks = {
    todo: filteredTasks?.filter((t) => t.status === 'todo') || [],
    in_progress: filteredTasks?.filter((t) => t.status === 'in_progress') || [],
    done: filteredTasks?.filter((t) => t.status === 'done') || [],
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">タスク管理</h1>
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/')} className="text-gray-600 hover:text-gray-900">
                ダッシュボード
              </button>
              <button
                onClick={() => navigate('/projects')}
                className="text-gray-600 hover:text-gray-900"
              >
                プロジェクト
              </button>
              <button onClick={handleLogout} className="text-gray-600 hover:text-gray-900">
                ログアウト
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <select
              value={projectId || 'all'}
              onChange={handleProjectFilter}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">すべてのプロジェクト</option>
              {projects?.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as Task['status'] | 'all')}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">すべてのステータス</option>
              <option value="todo">未着手</option>
              <option value="in_progress">進行中</option>
              <option value="done">完了</option>
            </select>

            <p className="text-gray-600">{filteredTasks?.length || 0} 件のタスク</p>
          </div>

          <button
            onClick={handleCreateTask}
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
            新規タスク
          </button>
        </div>

        {filteredTasks && filteredTasks.length > 0 ? (
          statusFilter === 'all' ? (
            // カンバンボード表示
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  未着手 ({groupedTasks.todo.length})
                </h2>
                <div className="space-y-4">
                  {groupedTasks.todo.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={handleEditTask}
                      onDelete={handleDeleteTask}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  進行中 ({groupedTasks.in_progress.length})
                </h2>
                <div className="space-y-4">
                  {groupedTasks.in_progress.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={handleEditTask}
                      onDelete={handleDeleteTask}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  完了 ({groupedTasks.done.length})
                </h2>
                <div className="space-y-4">
                  {groupedTasks.done.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={handleEditTask}
                      onDelete={handleDeleteTask}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // リスト表示
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">タスクがありません</h3>
            <p className="mt-1 text-sm text-gray-500">新規タスクを作成して始めましょう</p>
            <div className="mt-6">
              <button
                onClick={handleCreateTask}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                新規タスク
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Modal */}
      {projects && (
        <TaskFormModal
          key={editingTask?.id || 'new'}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          task={editingTask}
          projects={projects}
          isLoading={createTask.isPending || updateTask.isPending}
        />
      )}
    </div>
  );
};
