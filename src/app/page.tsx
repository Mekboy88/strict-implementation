import React from 'react'

// Main marketplace preview entry used by LivePreview
// This ensures the IDE always has a clear root component to render.
export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-12 text-center">
        <div className="mb-6">
          <div className="text-6xl mb-4">🚀</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-3">Welcome to UR-DEV</h1>
          <p className="text-lg text-gray-600">
            Your AI-powered development environment is ready!
          </p>
        </div>
        <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-gray-700 mb-2">
            <strong>👋 Start building:</strong>
          </p>
          <p className="text-sm text-gray-600">
            Use the AI chat below to create pages, components, and features.
            The Live Preview will update automatically!
          </p>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 text-left">
          <div className="p-4 bg-white rounded-lg border border-gray-200">
            <div className="text-2xl mb-2">💬</div>
            <h3 className="font-semibold text-gray-800 mb-1">AI Chat</h3>
            <p className="text-xs text-gray-600">
              Tell the AI what to build and it generates complete files
            </p>
          </div>
          <div className="p-4 bg-white rounded-lg border border-gray-200">
            <div className="text-2xl mb-2">👁️</div>
            <h3 className="font-semibold text-gray-800 mb-1">Live Preview</h3>
            <p className="text-xs text-gray-600">
              See your changes instantly without any setup
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
