import { Link, useLocation } from 'react-router-dom';
import { useLogout } from '../hooks/useAuth';

export const Navbar = () => {
  const location = useLocation();
  const logout = useLogout();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navLinkClass = (path: string) => {
    const baseClass = 'px-3 py-2 rounded-md text-sm font-medium transition-colors';
    return isActive(path)
      ? `${baseClass} bg-indigo-700 text-white`
      : `${baseClass} text-indigo-100 hover:bg-indigo-600 hover:text-white`;
  };

  return (
    <nav className="bg-indigo-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <svg
                className="w-8 h-8 text-white mr-2"
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
              <span className="text-xl font-bold text-white">Time Tracker</span>
            </Link>

            <div className="hidden md:flex md:ml-10 md:space-x-2">
              <Link to="/" className={navLinkClass('/')}>
                ダッシュボード
              </Link>
              <Link to="/projects" className={navLinkClass('/projects')}>
                プロジェクト
              </Link>
              <Link to="/tasks" className={navLinkClass('/tasks')}>
                タスク
              </Link>
              <Link to="/time-tracking" className={navLinkClass('/time-tracking')}>
                時間記録
              </Link>
              <Link to="/reports" className={navLinkClass('/reports')}>
                レポート
              </Link>
            </div>
          </div>

          <div className="flex items-center">
            <button
              onClick={logout}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-700 rounded-md hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              ログアウト
            </button>
          </div>
        </div>
      </div>

      {/* モバイルメニュー */}
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link to="/" className={`block ${navLinkClass('/')}`}>
            ダッシュボード
          </Link>
          <Link to="/projects" className={`block ${navLinkClass('/projects')}`}>
            プロジェクト
          </Link>
          <Link to="/tasks" className={`block ${navLinkClass('/tasks')}`}>
            タスク
          </Link>
          <Link to="/time-tracking" className={`block ${navLinkClass('/time-tracking')}`}>
            時間記録
          </Link>
          <Link to="/reports" className={`block ${navLinkClass('/reports')}`}>
            レポート
          </Link>
        </div>
      </div>
    </nav>
  );
};
