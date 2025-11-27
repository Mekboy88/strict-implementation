export default function Page() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="max-w-5xl w-full">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">UR-DEV Preview Online</h1>
          <p className="text-gray-600 text-sm">
            This is a safe static version of your UR-DEV project so the live preview never stays blank.
          </p>
        </header>

        <section className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <article className="bg-white rounded-lg shadow-md border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Editor Panel</h2>
            <p className="text-sm text-gray-600">
              Shows your TSX code exactly like in the UR-DEV IDE. Changes here will drive future builds.
            </p>
          </article>

          <article className="bg-white rounded-lg shadow-md border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">AI Builder</h2>
            <p className="text-sm text-gray-600">
              The AI can still create full React + TypeScript code. This preview is a simplified visual frame.
            </p>
          </article>

          <article className="bg-white rounded-lg shadow-md border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Preview Frame</h2>
            <p className="text-sm text-gray-600">
              You are seeing this because the full compiler is strict. This static page guarantees something visible.
            </p>
          </article>
        </section>
      </div>
    </main>
  );
}
