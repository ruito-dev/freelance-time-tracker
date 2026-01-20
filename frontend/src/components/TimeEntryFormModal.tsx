import { useState, useEffect } from 'react';
import type { TimeEntry } from '../types/timeEntry';
import { useCreateTimeEntry, useUpdateTimeEntry } from '../hooks/useTimeEntries';
import { useTasks } from '../hooks/useTasks';

interface TimeEntryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  timeEntry?: TimeEntry;
  defaultTaskId?: number;
}

export const TimeEntryFormModal = ({
  isOpen,
  onClose,
  timeEntry,
  defaultTaskId,
}: TimeEntryFormModalProps) => {
  const [taskId, setTaskId] = useState<number>(defaultTaskId || 0);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: tasks } = useTasks();
  const createTimeEntry = useCreateTimeEntry();
  const updateTimeEntry = useUpdateTimeEntry();

  useEffect(() => {
    if (timeEntry) {
      setTaskId(timeEntry.task_id);
      setStartTime(formatDateTimeLocal(timeEntry.started_at));
      setEndTime(timeEntry.ended_at ? formatDateTimeLocal(timeEntry.ended_at) : '');
      setDescription(timeEntry.description || '');
    } else {
      setTaskId(defaultTaskId || 0);
      setStartTime('');
      setEndTime('');
      setDescription('');
    }
  }, [timeEntry, defaultTaskId]);

  const formatDateTimeLocal = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!taskId || !startTime) {
      alert('タスクと開始時刻は必須です');
      return;
    }

    setIsSubmitting(true);

    try {
      const data = {
        task_id: taskId,
        started_at: new Date(startTime).toISOString(),
        ended_at: endTime ? new Date(endTime).toISOString() : undefined,
        description,
      };

      if (timeEntry) {
        await updateTimeEntry.mutateAsync({ id: timeEntry.id, data });
      } else {
        await createTimeEntry.mutateAsync(data);
      }

      // フォームをリセット
      setTaskId(defaultTaskId || 0);
      setStartTime('');
      setEndTime('');
      setDescription('');

      onClose();
    } catch (error) {
      console.error('時間記録の保存に失敗しました:', error);
      alert('時間記録の保存に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {timeEntry ? '時間記録を編集' : '時間記録を追加'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              タスク *
            </label>
            <select
              value={taskId}
              onChange={(e) => setTaskId(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value={0}>タスクを選択</option>
              {tasks?.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.project?.name} - {task.title}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              開始時刻 *
            </label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              終了時刻
            </label>
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              説明
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="作業内容を入力..."
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              disabled={isSubmitting}
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? '保存中...' : '保存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
