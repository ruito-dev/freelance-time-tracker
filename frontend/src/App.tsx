function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Freelance Time Tracker
        </h1>
        <p className="text-lg text-gray-600">
          タスク管理 & 時間トラッキングアプリ
        </p>
        <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            技術スタック
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>React + TypeScript</li>
            <li>Vite</li>
            <li>Tailwind CSS</li>
            <li>TanStack Query (React Query)</li>
            <li>React Router</li>
            <li>Rails API (Backend)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default App
