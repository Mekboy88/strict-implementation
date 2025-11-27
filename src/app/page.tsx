export default function Page() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="max-w-2xl w-full text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          ✅ CDN-Free Preview System
        </h1>
        <p className="text-lg text-muted-foreground">
          This preview works without any external CDN scripts!
        </p>
        <div className="bg-card border border-border rounded-lg p-6 shadow-lg">
          <p className="text-sm text-secondary-foreground">
            No unpkg.com • No cdn.tailwindcss.com • No babel standalone
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Pure static HTML rendering with inline styles
          </p>
        </div>
      </div>
    </main>
  )
}
