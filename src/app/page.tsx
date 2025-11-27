export default function Page() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Hello Preview - CDN-Free System!
        </h1>
        <p className="text-lg text-muted-foreground">
          ✅ This preview works without any external CDN scripts
        </p>
        <p className="text-sm text-muted-foreground">
          No unpkg.com • No cdn.tailwindcss.com • No babel standalone
        </p>
      </div>
    </main>
  )
}
