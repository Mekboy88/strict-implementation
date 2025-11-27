export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50 flex items-center justify-center p-8">
      <div className="max-w-5xl w-full grid gap-10 md:grid-cols-[1.4fr,1fr] items-center">
        {/* Left: Bakery hero content */}
        <section className="space-y-6">
          <p className="text-sm font-semibold tracking-wide text-amber-700 uppercase">
            Fresh every morning
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-stone-900 leading-tight">
            Bakery Shop
          </h1>
          <p className="text-base md:text-lg text-stone-700 max-w-xl">
            Handcrafted breads, pastries and cakes baked in small batches. Customize
            your own selection and preview your shop layout right here in the editor.
          </p>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-white/80 backdrop-blur shadow-sm border border-amber-100 p-4 text-left">
              <p className="text-sm font-semibold text-stone-900">Sourdough Loaf</p>
              <p className="mt-1 text-xs text-stone-600">Crispy crust, airy crumb</p>
              <p className="mt-3 text-sm font-bold text-amber-700">$4.50</p>
            </div>
            <div className="rounded-2xl bg-white/80 backdrop-blur shadow-sm border border-amber-100 p-4 text-left">
              <p className="text-sm font-semibold text-stone-900">Croissant Box</p>
              <p className="mt-1 text-xs text-stone-600">6 flaky butter croissants</p>
              <p className="mt-3 text-sm font-bold text-amber-700">$9.90</p>
            </div>
            <div className="rounded-2xl bg-white/80 backdrop-blur shadow-sm border border-amber-100 p-4 text-left">
              <p className="text-sm font-semibold text-stone-900">Custom Cake</p>
              <p className="mt-1 text-xs text-stone-600">Perfect for celebrations</p>
              <p className="mt-3 text-sm font-bold text-amber-700">From $29.00</p>
            </div>
          </div>

          <p className="text-xs text-stone-500 max-w-md">
            This page is intentionally simple and mostly static so the preview engine
            can render it perfectly while the AI helps you evolve it into a full
            Bakery app.
          </p>
        </section>

        {/* Right: Simple order summary card */}
        <aside className="rounded-3xl bg-white shadow-xl border border-amber-100 p-6 space-y-5 max-w-md mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-stone-900">Today&apos;s order</p>
              <p className="text-xs text-stone-500">Preview of your cart layout</p>
            </div>
            <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800 border border-amber-100">
              Open 7:00–19:00
            </span>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-stone-700">Sourdough Loaf</span>
              <span className="font-semibold text-stone-900">$4.50</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-700">2× Butter Croissant</span>
              <span className="font-semibold text-stone-900">$3.80</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-700">Slice of Cheesecake</span>
              <span className="font-semibold text-stone-900">$3.20</span>
            </div>
          </div>

          <div className="border-t border-amber-100 pt-4 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-stone-600">Subtotal</span>
              <span className="font-semibold text-stone-900">$11.50</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-600">Tax</span>
              <span className="font-semibold text-stone-900">$0.80</span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-stone-900 font-semibold">Total</span>
              <span className="text-lg font-bold text-amber-700">$12.30</span>
            </div>
          </div>

          <button
            type="button"
            className="w-full mt-2 inline-flex items-center justify-center rounded-full bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-amber-700 transition-colors"
          >
            Checkout preview
          </button>
        </aside>
      </div>
    </main>
  );
}
