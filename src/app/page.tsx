import React from "react";

// Main marketplace preview entry used by LivePreview
// This ensures the IDE always has a clear root component to render.
export default function Page() {
  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="max-w-2xl px-8 py-10 rounded-2xl border border-border bg-card/80 shadow-xl space-y-4 text-center">
        <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-primary">
          UR-DEV · MARKETPLACE PREVIEW
        </p>
        <h1 className="text-2xl sm:text-3xl font-semibold">Marketplace Home Page</h1>
        <p className="text-sm text-muted-foreground">
          This is the main entry component that the Live Preview renders. When the AI builds
          your marketplace (product grids, filters, vendor sections, etc.), it should mount
          those components inside this page.
        </p>
      </div>
    </main>
  );
}
