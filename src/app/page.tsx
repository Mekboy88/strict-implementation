export default function Page() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="max-w-2xl w-full text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          ✅ CDN-Free Preview
        </h1>
        <p className="text-lg text-gray-600">
          This preview works without any external scripts!
        </p>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 shadow-lg">
          <p className="text-sm text-gray-700">
            No unpkg.com • No cdn.tailwindcss.com • No babel standalone
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Pure inline runtime with guaranteed rendering
          </p>
        </div>
      </div>
    </main>
  );
}
