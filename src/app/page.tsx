export default function Page() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="max-w-6xl w-full">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Shuse Shop</h1>
          <p className="text-gray-600 text-sm">
            Static preview of your shoe store layout. This version is designed so the preview can build and show everything properly.
          </p>
        </header>

        <section className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <article className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="h-48 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
              Shoe image 1
            </div>
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-900">Red Runner</h2>
              <p className="mt-1 text-sm text-gray-600">Lightweight running shoe for everyday training.</p>
              <p className="mt-3 text-base font-bold text-gray-900">$49.99</p>
            </div>
          </article>

          <article className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="h-48 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
              Shoe image 2
            </div>
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-900">Street Sneaker</h2>
              <p className="mt-1 text-sm text-gray-600">Casual sneaker with cushioned sole and modern look.</p>
              <p className="mt-3 text-base font-bold text-gray-900">$59.90</p>
            </div>
          </article>

          <article className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="h-48 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
              Shoe image 3
            </div>
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-900">City Walker</h2>
              <p className="mt-1 text-sm text-gray-600">Comfortable everyday shoe for long days on your feet.</p>
              <p className="mt-3 text-base font-bold text-gray-900">$69.50</p>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
