import { useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../hooks/useAuth';
import { Layout } from '../components/Layout';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">読み込み中...</div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">ダッシュボード</h2>
        <p className="text-gray-600 mb-6">ようこそ、{user?.name}さん！</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/projects')}
            className="p-6 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:shadow-md transition-all text-left"
          >
            <div className="flex items-center gap-3 mb-2">
              <svg
                className="w-8 h-8 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900">プロジェクト</h3>
            </div>
            <p className="text-gray-600 text-sm">プロジェクトの作成・管理</p>
          </button>

          <button
            onClick={() => navigate('/tasks')}
            className="p-6 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:shadow-md transition-all text-left"
          >
            <div className="flex items-center gap-3 mb-2">
              <svg
                className="w-8 h-8 text-indigo-600"
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
              <h3 className="text-lg font-semibold text-gray-900">タスク</h3>
            </div>
            <p className="text-gray-600 text-sm">タスクの管理</p>
          </button>

          <button
            onClick={() => navigate('/time-tracking')}
            className="p-6 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:shadow-md transition-all text-left"
          >
            <div className="flex items-center gap-3 mb-2">
              <svg
                className="w-8 h-8 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900">時間記録</h3>
            </div>
            <p className="text-gray-600 text-sm">作業時間の記録</p>
          </button>

          <button
            onClick={() => navigate('/reports')}
            className="p-6 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:shadow-md transition-all text-left"
          >
            <div className="flex items-center gap-3 mb-2">
              <svg
                className="w-8 h-8 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900">レポート</h3>
            </div>
            <p className="text-gray-600 text-sm">作業時間の分析</p>
          </button>
        </div>
      </div>
    </Layout>
  );
};
