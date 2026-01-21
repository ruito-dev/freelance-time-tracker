import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { useTimeEntries } from '../hooks/useTimeEntries';
import { useProjects } from '../hooks/useProjects';
import { TimeEntryCard } from '../components/TimeEntryCard';
import { TimeEntryFormModal } from '../components/TimeEntryFormModal';
import type { TimeEntry } from '../types/timeEntry';

export const TimeTracking = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const projectId = searchParams.get('project');
  const taskId = searchParams.get('task');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTimeEntry, setEditingTimeEntry] = useState<TimeEntry | undefined>();
  const [selectedProjectId, setSelectedProjectId] = useState<number>(
    projectId ? Number(projectId) : 0
  );
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { data: projects } = useProjects();
  const { data: timeEntries, isLoading } = useTimeEntries({
    project_id: selectedProjectId || undefined,
    task_id: taskId ? Number(taskId) : undefined,
    start_date: startDate || undefined,
    end_date: endDate || undefined,
  });

  const handleEdit = (timeEntry: TimeEntry) => {
    setEditingTimeEntry(timeEntry);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTimeEntry(undefined);
  };

  const handleProjectFilterChange = (projectId: number) => {
    setSelectedProjectId(projectId);
    if (projectId) {
      setSearchParams({ project: projectId.toString() });
    } else {
      setSearchParams({});
    }
  };

  const calculateTotalHours = () => {
    if (!timeEntries) return 0;

    return timeEntries.reduce((total, entry) => {
      if (!entry.ended_at) return total;

      const start = new Date(entry.started_at);
      const end = new Date(entry.ended_at);
      const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      return total + hours;
    }, 0);
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">時間トラッキング</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          + 時間記録を追加
        </button>
      </div>

      {/* フィルター */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">プロジェクト</label>
            <select
              value={selectedProjectId}
              onChange={(e) => handleProjectFilterChange(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value={0}>すべてのプロジェクト</option>
              {projects?.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">開始日</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">終了日</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {timeEntries && timeEntries.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              合計時間:{' '}
              <span className="font-semibold text-gray-900">
                {calculateTotalHours().toFixed(2)}時間
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 時間記録一覧 */}
      {isLoading ? (
        <div className="text-center py-8 text-gray-500">読み込み中...</div>
      ) : timeEntries && timeEntries.length > 0 ? (
        <div className="space-y-4">
          {timeEntries.map((timeEntry) => (
            <TimeEntryCard key={timeEntry.id} timeEntry={timeEntry} onEdit={handleEdit} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">時間記録がありません</div>
      )}

      {/* モーダル */}
      <TimeEntryFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        timeEntry={editingTimeEntry}
      />
    </Layout>
  );
};
