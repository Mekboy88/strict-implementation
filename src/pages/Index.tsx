import React, { useState } from "react";
import {
  Folder,
  FileCode2,
  Search,
  Settings2,
  Paperclip,
  HelpCircle,
  WalletCards,
  ShoppingBag,
  MessageCircle,
} from "lucide-react";

const initialFiles = [
  {
    id: "banner",
    name: "banner.tsx",
    path: "src/components/banner.tsx",
    language: "tsx",
    content: [
      "import React from 'react'",
      "",
      "export function Banner() {",
      "  return (",
      '    <section className="px-8 py-10 bg-slate-900/60 border-b border-slate-800">',
      '      <h1 className="text-2xl font-semibold text-sky-200">UR-DEV Banner</h1>',
      '      <p className="mt-2 text-sm text-slate-300 max-w-xl">',
      "        This is a demo banner component rendered inside the editor preview.",
      "      </p>",
      "    </section>",
      "  )",
      "}",
    ],
  },
  {
    id: "layout",
    name: "layout.tsx",
    path: "src/app/layout.tsx",
    language: "tsx",
    content: [
      "import React from 'react'",
      "",
      "export default function RootLayout({ children }) {",
      "  return (",
      '    <html lang="en">',
      '      <body className="bg-slate-950 text-slate-100">{children}</body>',
      "    </html>",
      "  )",
      "}",
    ],
  },
  {
    id: "page",
    name: "page.tsx",
    path: "src/app/page.tsx",
    language: "tsx",
    content: [
      "import React from 'react'",
      "import { Banner } from '../components/banner'",
      "",
      "export default function Page() {",
      "  return (",
      '    <main className="min-h-screen bg-slate-950">',
      "      <Banner />",
      "    </main>",
      "  )",
      "}",
    ],
  },
];

function buildInitialContents() {
  const map: Record<string, string> = {};
  for (const file of initialFiles) {
    map[file.id] = file.content.join(`
`);
  }
  return map;
}

function UrDevPreviewFrame() {
  return (
    <div className="h-full w-full rounded-2xl border border-white/10 bg-slate-950 overflow-hidden shadow-[0_0_55px_rgba(15,23,42,0.9)]">
      <div className="flex items-center justify-between border-b border-white/10 bg-black/80 px-4 py-2 text-[11px] text-slate-300">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-2 w-2 rounded-full bg-rose-500" />
          <span className="inline-flex h-2 w-2 rounded-full bg-amber-400" />
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          <span className="ml-3 text-xs text-slate-400">UR-DEV · Preview</span>
        </div>
        <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-slate-400">
          Desktop · 100%
        </span>
      </div>
      <div className="h-full overflow-auto bg-gradient-to-b from-slate-950 via-slate-900 to-black">
        <main className="min-h-[540px] px-10 py-10">
          <section className="mx-auto max-w-4xl rounded-2xl border border-slate-800/80 bg-slate-950/80 px-10 py-10 shadow-[0_0_45px_rgba(8,47,73,0.75)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
              UR-DEV · LIVE PREVIEW
            </p>
            <h1 className="mt-4 text-3xl font-semibold text-sky-100 sm:text-4xl">
              UR-DEV Banner preview
            </h1>
            <p className="mt-3 max-w-xl text-sm text-slate-300">
              This area simulates how your <span className="font-mono text-cyan-300">banner.tsx</span>{" "}
              component will render inside the app shell. When you switch back to{" "}
              <span className="font-semibold text-sky-200">Code</span>, you can continue editing the
              component line by line.
            </p>
            <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900/70 px-7 py-6">
              <h2 className="text-xl font-semibold text-sky-100">UR-DEV Banner</h2>
              <p className="mt-2 text-sm text-slate-300">
                This is a demo banner component rendered inside the editor preview. You can adapt the
                structure to match your real project once the full compiler integration is wired in.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 text-[11px]">
                <span className="inline-flex items-center rounded-full bg-sky-500/15 px-3 py-1 text-sky-200">
                  • React component
                </span>
                <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-3 py-1 text-emerald-200">
                  • Tailwind styles
                </span>
                <span className="inline-flex items-center rounded-full bg-violet-500/15 px-3 py-1 text-violet-200">
                  • UR-DEV layout frame
                </span>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function UrDevEditorPage() {
  const [activeFileId, setActiveFileId] = useState("banner");
  const [fileContents, setFileContents] = useState<Record<string, string>>(() =>
    buildInitialContents()
  );
  const [showReasoning, setShowReasoning] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);

  const activeFile = initialFiles.find((file) => file.id === activeFileId) || initialFiles[0];
  const currentContent = fileContents[activeFileId] || activeFile.content.join(`
`);
  const currentLines = currentContent.split(`
`);
  const originalLines = activeFile.content;

  function handleChangeContent(value: string) {
    setFileContents((prev) => ({ ...prev, [activeFileId]: value }));
  }

  async function handleCopyFile() {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(currentContent);
      }
    } catch {
      // ignore clipboard failures
    }
  }

  function isLineChanged(index: number, line: string) {
    return line !== (originalLines[index] || "");
  }

  const hasFileChanges = currentContent !== activeFile.content.join(`
`);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col">
      {/* TOP BAR */}
      <header className="flex items-center justify-between border-b border-white/10 bg-black/90 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 border border-cyan-400/70 text-xs font-semibold text-cyan-200">
            UR
          </div>
          <div>
            <div className="text-sm font-semibold tracking-tight">UR-DEV IDE</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
              YOU ARE THE DEVELOPER
            </div>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-1 py-1 text-[11px]">
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className={`rounded-full px-3 py-1 ${
              showPreview ? "bg-sky-500 text-black font-semibold" : "text-slate-300 hover:text-white"
            }`}
          >
            Preview
          </button>
          <button className="rounded-full px-3 py-1 text-slate-300 hover:text-white">Design</button>
          <button
            type="button"
            onClick={() => setShowPreview(false)}
            className={`rounded-full px-3 py-1 ${
              !showPreview
                ? "bg-sky-500 text-black font-semibold shadow-[0_0_18px_rgba(56,189,248,0.6)]"
                : "text-slate-300 hover:text-white"
            }`}
          >
            Code
          </button>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <button className="hidden sm:inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-slate-200 hover:border-cyan-400/70 hover:text-cyan-100">
            <span className="text-xs">▶</span>
            <span>Run checks</span>
          </button>
          <button className="inline-flex items-center gap-1 rounded-full bg-sky-500 px-4 py-1.5 text-[11px] font-semibold text-black shadow-[0_0_22px_rgba(56,189,248,0.8)] hover:bg-sky-400">
            <span>Preview</span>
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-black/20 text-[10px]">
              ↗
            </span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* FAR LEFT ACTIVITY RAIL */}
        <aside className="hidden lg:flex w-12 flex-col items-center justify-between border-r border-white/10 bg-[#030711] py-3">
          <div className="flex flex-col items-center gap-3">
            <button className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-cyan-500/20 text-xs font-semibold text-cyan-200 border border-cyan-400/70">
              UR
            </button>
            <button className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 text-slate-200 hover:bg-white/10">
              <Folder className="h-4 w-4" />
            </button>
            <button className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 text-slate-200 hover:bg-white/10">
              <FileCode2 className="h-4 w-4" />
            </button>
            <button className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 text-slate-200 hover:bg-white/10">
              <span className="text-[11px]">▶</span>
            </button>
          </div>
          <button className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 text-slate-300 hover:bg-white/10">
            <Settings2 className="h-4 w-4" />
          </button>
        </aside>

        {/* LEFT SIDEBAR (EXPLORER) */}
        <aside className="hidden lg:flex w-72 flex-col border-r border-white/10 bg-[#050816]">
          <div className="px-3 py-3 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-100">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-slate-900 border border-slate-700">
                  <Folder className="h-3 w-3 text-slate-300" />
                </span>
                <span>Explorer</span>
              </div>
              <button className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-slate-900 text-slate-400 border border-slate-700">
                <Settings2 className="h-3 w-3" />
              </button>
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-md bg-slate-900 px-2 py-1 text-[11px] text-slate-300 border border-slate-700/80">
              <Search className="h-3 w-3 text-slate-500" />
              <input
                className="flex-1 bg-transparent outline-none placeholder:text-slate-600"
                placeholder="Search files..."
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-2 py-3 text-[11px] text-slate-300">
            <div className="mb-2 px-2 text-slate-500 uppercase tracking-[0.16em] text-[10px]">
              PROJECT
            </div>
            <div className="space-y-1">
              <button className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-slate-400 hover:bg-white/5">
                <Folder className="h-3 w-3" />
                <span>node_modules</span>
              </button>
              <button className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-slate-400 hover:bg-white/5">
                <Folder className="h-3 w-3" />
                <span>public</span>
              </button>
              <button className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-slate-200 hover:bg-white/5">
                <Folder className="h-3 w-3" />
                <span>src</span>
              </button>

              <div className="ml-5 space-y-1">
                <button className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-slate-300 hover:bg-white/5">
                  <Folder className="h-3 w-3" />
                  <span>components</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFileId("banner")}
                  className={`ml-4 flex w-full items-center justify-between rounded-md px-2 py-1 text-left ${
                    activeFileId === "banner"
                      ? "bg-sky-500/25 text-sky-100"
                      : "hover:bg-white/5 hover:text-sky-100"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <FileCode2 className="h-3 w-3" />
                    <span>banner.tsx</span>
                  </span>
                  <span className="text-[9px] text-slate-400">TSX</span>
                </button>
              </div>

              <div className="ml-5 space-y-1">
                <button className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-slate-300 hover:bg-white/5">
                  <Folder className="h-3 w-3" />
                  <span>app</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFileId("layout")}
                  className={`ml-4 flex w-full items-center justify-between rounded-md px-2 py-1 text-left ${
                    activeFileId === "layout"
                      ? "bg-sky-500/25 text-sky-100"
                      : "hover:bg-white/5 hover:text-sky-100"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <FileCode2 className="h-3 w-3" />
                    <span>layout.tsx</span>
                  </span>
                  <span className="text-[9px] text-slate-400">TSX</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFileId("page")}
                  className={`ml-4 flex w-full items-center justify-between rounded-md px-2 py-1 text-left ${
                    activeFileId === "page"
                      ? "bg-sky-500/25 text-sky-100"
                      : "hover:bg-white/5 hover:text-sky-100"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <FileCode2 className="h-3 w-3" />
                    <span>page.tsx</span>
                  </span>
                  <span className="text-[9px] text-slate-400">TSX</span>
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 px-4 py-3 text-[10px] text-slate-500 flex items-center justify-between">
            <button className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 text-[10px] text-slate-200 hover:bg-white/10">
              <Settings2 className="h-3 w-3" />
              <span>Project settings</span>
            </button>
            <span className="text-[9px] text-slate-600">UR-DEV workspace</span>
          </div>
        </aside>

        {/* CENTER: EDITOR OR PREVIEW */}
        <main className="flex-1 flex overflow-hidden">
          <section className="flex-1 flex flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-black">
            {showPreview ? (
              <div className="flex-1 overflow-auto">
                <UrDevPreviewFrame />
              </div>
            ) : (
              <>
                {/* File tabs + copy */}
                <div className="flex items-center justify-between border-b border-white/10 bg-black/70 px-4 py-2 text-[11px]">
                  <div className="flex items-center gap-2 overflow-x-auto">
                    {initialFiles.map((file) => {
                      const isActive = file.id === activeFileId;
                      return (
                        <button
                          key={file.id}
                          type="button"
                          onClick={() => setActiveFileId(file.id)}
                          className={`inline-flex items-center gap-2 rounded-t-md border-b-2 px-3 py-1 ${
                            isActive
                              ? "border-sky-400 bg-black text-sky-100"
                              : "border-transparent text-slate-400 hover:text-slate-100"
                          }`}
                        >
                          <span>{file.name}</span>
                          <span className="text-[9px] uppercase text-slate-500">
                            {file.language}
                          </span>
                          {file.id === activeFileId && hasFileChanges && (
                            <span className="ml-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-[9px] text-amber-300">
                              Modified
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <button
                      type="button"
                      onClick={handleCopyFile}
                      className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-3 py-1 hover:border-sky-400/70 hover:text-sky-100"
                    >
                      <span className="text-xs">⧉</span>
                      <span>Copy file</span>
                    </button>
                    <span className="hidden sm:inline rounded-full bg-emerald-500/20 px-2 py-0.5 text-emerald-200">
                      {hasFileChanges ? "Unsaved changes" : "Saved"}
                    </span>
                  </div>
                </div>

                {/* Editor surface */}
                <div className="flex-1 overflow-hidden">
                  <div className="relative h-full rounded-none border-0 bg-transparent shadow-none">
                    <div className="flex items-center justify-between border-b border-white/10 px-4 py-2 text-[11px] text-slate-400 bg-black/80">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-2 w-2 rounded-full bg-rose-500" />
                        <span className="inline-flex h-2 w-2 rounded-full bg-amber-400" />
                        <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                        <span className="ml-3 font-medium text-slate-300">{activeFile.path}</span>
                      </div>
                      <span className="hidden sm:inline text-[10px] text-slate-500">
                        Editing in UR-DEV. Changes are highlighted in the gutter.
                      </span>
                    </div>

                    <div className="flex h-full min-h-[720px] text-[13px] font-mono leading-relaxed overflow-hidden">
                      <div className="select-none border-r border-white/5 bg-slate-950/90 px-3 py-3 text-right text-slate-500 min-w-[46px] overflow-y-hidden text-[13px] leading-relaxed">
                        {currentLines.map((line, index) => (
                          <div
                            key={index}
                            className={
                              isLineChanged(index, line)
                                ? "bg-amber-500/10 text-amber-300 -mx-1 px-1 rounded-sm"
                                : ""
                            }
                          >
                            {index + 1}
                          </div>
                        ))}
                      </div>
                      <textarea
                        value={currentContent}
                        onChange={(e) => handleChangeContent(e.target.value)}
                        spellCheck={false}
                        className="flex-1 h-full resize-none bg-slate-950 px-4 py-3 text-[13px] text-emerald-200 outline-none whitespace-pre overflow-auto leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </section>

          {/* RIGHT ASSISTANT PANEL */}
          <aside className="hidden xl:flex w-80 min-w-[260px] max-w-[520px] resize-x overflow-hidden flex-col border-l border-white/10 bg-black/95">
            <div className="border-b border-white/10 px-4 py-3 text-[11px] flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-100">UR-DEV Assistant</div>
                <div className="mt-0.5 text-[10px] text-slate-500">
                  Academic-grade explanations for your code.
                </div>
              </div>
              <span className="rounded-full border border-emerald-400/60 bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-200">
                Online
              </span>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 text-[11px]">
              <div className="rounded-2xl border border-white/10 bg-slate-950/90 p-3">
                <button
                  type="button"
                  onClick={() => setShowReasoning((v) => !v)}
                  className="flex w-full items-center justify-between rounded-lg bg-white/5 px-3 py-1 text-[11px] text-slate-200"
                >
                  <span>Reasoning</span>
                  <span className="text-xs">{showReasoning ? "▾" : "▸"}</span>
                </button>
                {showReasoning && (
                  <div className="mt-2 rounded-lg bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 animate-pulse px-3 py-2 text-[11px] text-slate-200">
                    The assistant analyses the current file, identifies structural issues, and
                    proposes a clear, maintainable revision plan before suggesting any code edits.
                  </div>
                )}
                <div className="mt-3 space-y-2 text-slate-100">
                  <p>
                    I have examined the active component and identified opportunities to simplify its
                    layout, improve naming, and separate visual concerns from logic. The next step is
                    to introduce small, focused helpers while preserving the original behaviour.
                  </p>
                  <p className="text-slate-300">
                    All suggestions are conservative, emphasising readability, long-term
                    maintainability, and type safety.
                  </p>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button className="rounded-full bg-emerald-500 px-3 py-1 text-[11px] font-semibold text-black hover:bg-emerald-400">
                    Error fixing
                  </button>
                  <button className="rounded-full bg-emerald-500 px-3 py-1 text-[11px] font-semibold text-black hover:bg-emerald-400">
                    Find logic bugs
                  </button>
                  <button className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-[11px] text-slate-100 hover:border-sky-400/80 hover:text-sky-100">
                    Suggest refactor
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950/90 p-3">
                <div className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
                  Recent analysis
                </div>
                <ul className="mt-2 space-y-1 text-slate-300">
                  <li>• Verified props and state usage are coherent.</li>
                  <li>• No unreachable branches detected in this file.</li>
                  <li>• Recommended extracting layout into smaller sections.</li>
                </ul>
              </div>
            </div>

            <div className="border-t border-white/10 px-4 py-3">
              <div className="rounded-2xl border border-white/10 bg-slate-950/95 p-3 space-y-3">
                {showQuickActions && (
                  <div className="rounded-2xl bg-black/70 px-3 py-3">
                    <div className="grid grid-cols-3 gap-3 text-[11px] text-slate-100">
                      <button className="flex flex-col items-center gap-2 rounded-xl bg-white/5 px-3 py-2 hover:bg-white/10">
                        <Paperclip className="h-4 w-4" />
                        <span>Attach File</span>
                      </button>
                      <button className="flex flex-col items-center gap-2 rounded-xl bg-white/5 px-3 py-2 hover:bg-white/10">
                        <Settings2 className="h-4 w-4" />
                        <span>Settings</span>
                      </button>
                      <button className="flex flex-col items-center gap-2 rounded-xl bg-white/5 px-3 py-2 hover:bg-white/10">
                        <WalletCards className="h-4 w-4" />
                        <span>Wallet</span>
                      </button>
                      <button className="flex flex-col items-center gap-2 rounded-xl bg-white/5 px-3 py-2 hover:bg-white/10">
                        <HelpCircle className="h-4 w-4" />
                        <span>Help</span>
                      </button>
                      <button className="flex flex-col items-center gap-2 rounded-xl bg-white/5 px-3 py-2 hover:bg-white/10">
                        <ShoppingBag className="h-4 w-4" />
                        <span>Market</span>
                      </button>
                      <button className="flex flex-col items-center gap-2 rounded-xl bg-white/5 px-3 py-2 hover:bg-white/10">
                        <MessageCircle className="h-4 w-4" />
                        <span>Community</span>
                      </button>
                    </div>
                  </div>
                )}
                <div className="flex items-end gap-2 rounded-xl bg-black/80 px-3 py-2">
                  <button
                    type="button"
                    onClick={() => setShowQuickActions((v) => !v)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-slate-100 hover:bg-white/10"
                  >
                    <Settings2 className="h-4 w-4" />
                  </button>
                  <input
                    className="flex-1 bg-transparent text-[11px] text-slate-100 placeholder:text-slate-500 outline-none"
                    placeholder="Ask UR-DEV to analyse or rewrite this file in an academic tone…"
                  />
                  <button className="inline-flex items-center justify-center rounded-lg bg-sky-500 px-4 py-1.5 text-[11px] font-semibold text-black shadow-[0_0_18px_rgba(56,189,248,0.7)] hover:bg-sky-400">
                    Send
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}

export default UrDevEditorPage;
