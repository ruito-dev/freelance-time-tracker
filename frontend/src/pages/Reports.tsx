import { useState, useMemo } from 'react';
import { Layout } from '../components/Layout';
import { useTimeEntries } from '../hooks/useTimeEntries';
import { useProjects } from '../hooks/useProjects';
import { exportToCSV, formatDateForFilename } from '../utils/csvExport';

export const Reports = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<number>(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { data: projects } = useProjects();
  const { data: timeEntries, isLoading } = useTimeEntries({
    project_id: selectedProjectId || undefined,
    start_date: startDate || undefined,
    end_date: endDate || undefined,
  });

  // プロジェクト別の集計
  const projectStats = useMemo(() => {
    if (!timeEntries) return [];

    const stats = new Map<number, { name: string; hours: number; count: number }>();

    timeEntries.forEach((entry) => {
      if (!entry.ended_at) return;

      const projectId = entry.task.project?.id;
      const projectName = entry.task.project?.name || '不明';

      if (!projectId) return;

      const start = new Date(entry.started_at);
      const end = new Date(entry.ended_at);
      const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

      const current = stats.get(projectId) || { name: projectName, hours: 0, count: 0 };
      stats.set(projectId, {
        name: projectName,
        hours: current.hours + hours,
        count: current.count + 1,
      });
    });

    return Array.from(stats.values()).sort((a, b) => b.hours - a.hours);
  }, [timeEntries]);

  // タスク別の集計
  const taskStats = useMemo(() => {
    if (!timeEntries) return [];

    const stats = new Map<number, { title: string; projectName: string; hours: number; count: number }>();

    timeEntries.forEach((entry) => {
      if (!entry.ended_at) return;

      const taskId = entry.task_id;
      const taskTitle = entry.task.title;
      const projectName = entry.task.project?.name || '不明';

      const start = new Date(entry.started_at);
      const end = new Date(entry.ended_at);
      const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

      const current = stats.get(taskId) || { title: taskTitle, projectName, hours: 0, count: 0 };
      stats.set(taskId, {
        title: taskTitle,
        projectName,
        hours: current.hours + hours,
        count: current.count + 1,
      });
    });

    return Array.from(stats.values()).sort((a, b) => b.hours - a.hours);
  }, [timeEntries]);

  // 日別の集計
  const dailyStats = useMemo(() => {
    if (!timeEntries) return [];

    const stats = new Map<string, number>();

    timeEntries.forEach((entry) => {
      if (!entry.ended_at) return;

      const date = new Date(entry.started_at).toLocaleDateString('ja-JP');
      const start = new Date(entry.started_at);
      const end = new Date(entry.ended_at);
      const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

      stats.set(date, (stats.get(date) || 0) + hours);
    });

    return Array.from(stats.entries())
      .map(([date, hours]) => ({ date, hours }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [timeEntries]);

  const totalHours = useMemo(() => {
    return projectStats.reduce((sum, stat) => sum + stat.hours, 0);
  }, [projectStats]);

  // CSVエクスポート関数
  const handleExportProjectStats = () => {
    const data = [
      ['プロジェクト名', '作業時間（時間）', '記録数'],
      ...projectStats.map((stat) => [stat.name, stat.hours.toFixed(2), stat.count]),
      ['合計', totalHours.toFixed(2), projectStats.reduce((sum, stat) => sum + stat.count, 0)],
    ];
    exportToCSV(data, `プロジェクト別レポート_${formatDateForFilename()}.csv`);
  };

  const handleExportTaskStats = () => {
    const data = [
      ['タスク名', 'プロジェクト名', '作業時間（時間）', '記録数'],
      ...taskStats.map((stat) => [
        stat.title,
        stat.projectName,
        stat.hours.toFixed(2),
        stat.count,
      ]),
    ];
    exportToCSV(data, `タスク別レポート_${formatDateForFilename()}.csv`);
  };

  const handleExportDailyStats = () => {
    const data = [
      ['日付', '作業時間（時間）'],
      ...dailyStats.map((stat) => [stat.date, stat.hours.toFixed(2)]),
    ];
    exportToCSV(data, `日別レポート_${formatDateForFilename()}.csv`);
  };

  const handleExportTimeEntries = () => {
    if (!timeEntries) return;

    const data = [
      ['日付', '開始時刻', '終了時刻', 'プロジェクト', 'タスク', '説明', '作業時間（時間）'],
      ...timeEntries
        .filter((entry) => entry.ended_at)
        .map((entry) => {
          const start = new Date(entry.started_at);
          const end = new Date(entry.ended_at!);
          const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

          return [
            start.toLocaleDateString('ja-JP'),
            start.toLocaleTimeString('ja-JP'),
            end.toLocaleTimeString('ja-JP'),
            entry.task.project?.name || '不明',
            entry.task.title,
            entry.description || '',
            hours.toFixed(2),
          ];
        }),
    ];
    exportToCSV(data, `時間記録詳細_${formatDateForFilename()}.csv`);
  };

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">レポート</h1>
        {timeEntries && timeEntries.length > 0 && (
          <div className="flex gap-2">
            <button
              onClick={handleExportTimeEntries}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              全データをエクスポート
            </button>
          </div>
        )}
      </div>

      {/* フィルター */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              プロジェクト
            </label>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(Number(e.target.value))}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              開始日
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              終了日
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-gray-500">読み込み中...</div>
      ) : (
        <>
          {/* サマリー */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">合計時間</h3>
              <p className="text-3xl font-bold text-gray-900">{totalHours.toFixed(1)}h</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">記録数</h3>
              <p className="text-3xl font-bold text-gray-900">{timeEntries?.length || 0}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">平均時間/日</h3>
              <p className="text-3xl font-bold text-gray-900">
                {dailyStats.length > 0 ? (totalHours / dailyStats.length).toFixed(1) : 0}h
              </p>
            </div>
          </div>

          {/* プロジェクト別 */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">プロジェクト別</h2>
              {projectStats.length > 0 && (
                <button
                  onClick={handleExportProjectStats}
                  className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  CSV
                </button>
              )}
            </div>
            {projectStats.length > 0 ? (
              <div className="space-y-3">
                {projectStats.map((stat, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900">{stat.name}</span>
                        <span className="text-sm text-gray-600">
                          {stat.hours.toFixed(1)}h ({stat.count}件)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full"
                          style={{ width: `${(stat.hours / totalHours) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">データがありません</p>
            )}
          </div>

          {/* タスク別 */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">タスク別</h2>
              {taskStats.length > 0 && (
                <button
                  onClick={handleExportTaskStats}
                  className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  CSV
                </button>
              )}
            </div>
            {taskStats.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        タスク
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        プロジェクト
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        時間
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        記録数
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {taskStats.map((stat, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 text-sm text-gray-900">{stat.title}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{stat.projectName}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-right">
                          {stat.hours.toFixed(1)}h
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 text-right">
                          {stat.count}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">データがありません</p>
            )}
          </div>

          {/* 日別 */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">日別</h2>
              {dailyStats.length > 0 && (
                <button
                  onClick={handleExportDailyStats}
                  className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  CSV
                </button>
              )}
            </div>
            {dailyStats.length > 0 ? (
              <div className="space-y-2">
                {dailyStats.map((stat, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-900">{stat.date}</span>
                    <span className="text-sm font-medium text-gray-900">{stat.hours.toFixed(1)}h</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">データがありません</p>
            )}
          </div>
        </>
      )}
    </Layout>
  );
};
