import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TaskCard } from '../components/TaskCard';
import { TaskFormModal } from '../components/TaskFormModal';
import { SearchBar } from '../components/SearchBar';
import { Layout } from '../components/Layout';
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from '../hooks/useTasks';
import { useProjects } from '../hooks/useProjects';
import type { Task } from '../types/task';

export const Tasks = () => {
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
  const [priorityFilter, setPriorityFilter] = useState<Task['priority'] | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

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

  // フィルタリング
  const filteredTasks = useMemo(() => {
    if (!tasks) return [];

    return tasks.filter((task) => {
      // ステータスフィルター
      if (statusFilter !== 'all' && task.status !== statusFilter) {
        return false;
      }

      // 優先度フィルター
      if (priorityFilter !== 'all' && task.priority !== priorityFilter) {
        return false;
      }

      // 検索フィルター
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          task.title.toLowerCase().includes(query) ||
          task.description?.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [tasks, statusFilter, priorityFilter, searchQuery]);

  const groupedTasks = {
    todo: filteredTasks.filter((t) => t.status === 'todo'),
    in_progress: filteredTasks.filter((t) => t.status === 'in_progress'),
    done: filteredTasks.filter((t) => t.status === 'done'),
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
        <h1 className="text-2xl font-bold text-gray-900 mb-4">タスク管理</h1>
        
        {/* 検索バー */}
        <div className="mb-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="タスク名または説明で検索..."
          />
        </div>

        {/* フィルター */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-4 flex-wrap">
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

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as Task['priority'] | 'all')}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">すべての優先度</option>
              <option value="low">低</option>
              <option value="medium">中</option>
              <option value="high">高</option>
            </select>

            <p className="text-gray-600">
              {filteredTasks.length} 件のタスク
              {searchQuery && ` (${tasks?.length || 0} 件中)`}
            </p>
          </div>

          <button
            onClick={handleCreateTask}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2 whitespace-nowrap"
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
      </div>

      {filteredTasks.length > 0 ? (
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
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {searchQuery ? '検索結果がありません' : 'タスクがありません'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery
              ? '別のキーワードで検索してみてください'
              : '新規タスクを作成して始めましょう'}
          </p>
          {!searchQuery && (
            <div className="mt-6">
              <button
                onClick={handleCreateTask}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                新規タスク
              </button>
            </div>
          )}
        </div>
      )}

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
    </Layout>
  );
};
