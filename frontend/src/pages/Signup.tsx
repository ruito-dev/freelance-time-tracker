import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSignup } from '../hooks/useAuth';

export const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const signup = useSignup();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signup.mutate({
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">新規登録</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            または{' '}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              ログイン
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {signup.isError && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-800">
                {signup.error instanceof Error ? signup.error.message : '登録に失敗しました'}
              </div>
            </div>
          )}

          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="name" className="sr-only">
                名前
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="名前"
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                メールアドレス
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="メールアドレス"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                パスワード
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="パスワード（6文字以上）"
              />
            </div>
            <div>
              <label htmlFor="password-confirmation" className="sr-only">
                パスワード確認
              </label>
              <input
                id="password-confirmation"
                name="password-confirmation"
                type="password"
                autoComplete="new-password"
                required
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="パスワード確認"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={signup.isPending}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {signup.isPending ? '登録中...' : '登録'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
