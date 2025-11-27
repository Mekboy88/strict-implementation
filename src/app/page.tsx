export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full text-center space-y-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            ✅ Preview System Fixed
          </h1>
          <p className="text-lg text-slate-600 mb-6">
            This preview works with pure static HTML conversion - no external scripts needed!
          </p>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 space-y-3">
            <p className="text-sm font-medium text-slate-800">
              ✨ Features:
            </p>
            <ul className="text-sm text-slate-700 space-y-2 text-left">
              <li>• Robust JSX extraction with balanced parenthesis matching</li>
              <li>• Custom component placeholder support</li>
              <li>• Graceful error handling with styled fallbacks</li>
              <li>• No external dependencies or CDN scripts</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
