import { useState } from 'react';
import type { TimeEntry } from '../types/timeEntry';
import { useDeleteTimeEntry } from '../hooks/useTimeEntries';

interface TimeEntryCardProps {
  timeEntry: TimeEntry;
  onEdit: (timeEntry: TimeEntry) => void;
}

export const TimeEntryCard = ({ timeEntry, onEdit }: TimeEntryCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteTimeEntry = useDeleteTimeEntry();

  const handleDelete = async () => {
    if (!confirm('この時間記録を削除しますか?')) return;

    setIsDeleting(true);
    try {
      await deleteTimeEntry.mutateAsync(timeEntry.id);
    } catch (error) {
      console.error('時間記録の削除に失敗しました:', error);
      alert('時間記録の削除に失敗しました');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateDuration = () => {
    if (!timeEntry.ended_at) return '進行中';

    const start = new Date(timeEntry.started_at);
    const end = new Date(timeEntry.ended_at);
    const diffMs = end.getTime() - start.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}時間${minutes}分`;
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{timeEntry.task.title}</h3>
          <p className="text-sm text-gray-600">
            {timeEntry.task.project?.name}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(timeEntry)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            編集
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
          >
            {isDeleting ? '削除中...' : '削除'}
          </button>
        </div>
      </div>

      {timeEntry.description && (
        <p className="text-sm text-gray-700 mb-3">{timeEntry.description}</p>
      )}

      <div className="flex items-center justify-between text-sm text-gray-600">
        <div>
          <div>開始: {formatDateTime(timeEntry.started_at)}</div>
          {timeEntry.ended_at && (
            <div>終了: {formatDateTime(timeEntry.ended_at)}</div>
          )}
        </div>
        <div className="text-right">
          <div className="font-semibold text-gray-900">{calculateDuration()}</div>
        </div>
      </div>
    </div>
  );
};
