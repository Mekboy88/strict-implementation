import React, { useState } from "react";
import { Github, X, CheckCircle2, User, ArrowLeft, ExternalLink, FileCode2 } from "lucide-react";

type GithubState = "idle" | "connecting" | "connected";

interface GithubAccount {
  username: string;
  avatarUrl?: string;
}

interface GithubRepo {
  name: string;
  fullName: string; // e.g. "owner/repo"
  url: string;
}

interface UrDevGithubModalProps {
  isOpen: boolean;
  onClose: () => void;
  connectedAccount?: GithubAccount;
  connectedRepo?: GithubRepo;
  onConnect?: () => void;
}

function UrDevGithubModal({ isOpen, onClose, connectedAccount, connectedRepo, onConnect }: UrDevGithubModalProps) {
  const [state, setState] = useState<GithubState>(
    connectedAccount ? "connected" : "idle"
  );

  const [activeAccount, setActiveAccount] = useState<GithubAccount | undefined>(
    connectedAccount
  );

  const [showAccountSwitcher, setShowAccountSwitcher] = useState(false);

  function handleConnect() {
    if (state === "connected") return;

    // If a real GitHub connect handler is provided, delegate to it
    if (onConnect) {
      onConnect();
      return;
    }

    // Fallback demo behavior (used only when no handler is passed)
    setState("connecting");

    setTimeout(() => {
      const newAccount: GithubAccount = {
        username: "new-dev",
        avatarUrl: "https://avatars.githubusercontent.com/u/9919?v=4",
      };
      setActiveAccount(newAccount);
      setState("connected");
      setShowAccountSwitcher(false);
    }, 1200);
  }

  function handleClose() {
    onClose();
  }

  function handleOpenAccountSwitcher() {
    setShowAccountSwitcher(true);
  }

  function handleUseCurrentAccount() {
    setShowAccountSwitcher(false);
  }

  function handleConnectAnotherAccount() {
    setShowAccountSwitcher(false);
    setState("idle");
  }

  function handleManageOnGithub() {
    window.open(
      "https://github.com/settings/installations",
      "_blank",
      "noopener,noreferrer"
    );
  }

  const isConnected = state === "connected" || !!connectedAccount;

  const showAccount = connectedAccount
    ? connectedAccount
    : state === "connected" && activeAccount
      ? activeAccount
      : null;

  const repo = isConnected && connectedRepo ? connectedRepo : null;

  function handleOpenProjectOnGithub() {
    if (!repo) return;
    window.open(repo.url, "_blank", "noopener,noreferrer");
  }

  function handleOpenInVsCode() {
    if (!repo) return;
    const vsCodeUrl = `https://github.dev/${repo.fullName}`;
    window.open(vsCodeUrl, "_blank", "noopener,noreferrer");
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-2xl border border-white/15 bg-[#020617] shadow-[0_0_55px_rgba(15,23,42,0.95)]">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 border border-white/20">
              <Github className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-50">
                Connect GitHub
              </div>
              <div className="text-[11px] text-slate-400">
                Link your repositories to UR-DEV for live projects and commits.
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-slate-300 hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="relative px-6 py-5">
          {state === "idle" && !connectedAccount && (
            <>
              <p className="text-sm text-slate-200">
                Connect GitHub to sync branches, open pull requests, and keep
                your generated code in a real repository you fully control.
              </p>

              <ul className="mt-4 space-y-1 text-[12px] text-slate-300">
                <li>• Link one or more GitHub accounts or organizations.</li>
                <li>• Push UR-DEV changes directly to your repos.</li>
                <li>• Auto-open PRs for larger edits with clear diffs.</li>
              </ul>

              <button
                type="button"
                onClick={handleConnect}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-[0_0_26px_rgba(255,255,255,0.35)] hover:bg-slate-100"
              >
                <Github className="h-4 w-4" />
                <span>Connect with GitHub</span>
              </button>

              <p className="mt-3 text-[11px] text-slate-500">
                You&apos;ll be redirected to GitHub to authorize access. UR-DEV
                only uses the scopes you approve and never pushes code without
                confirmation.
              </p>
            </>
          )}

          {state === "connecting" && (
            <>
              <div className="rounded-xl border border-slate-500/40 bg-slate-900/50 px-4 py-3">
                <div className="flex items-center gap-2 text-sm text-slate-100">
                  <span className="relative inline-flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-slate-200/80 opacity-75" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-slate-100" />
                  </span>
                  <span>Connecting to GitHub…</span>
                </div>
                <p className="mt-2 text-[11px] text-slate-300/90">
                  Opening a secure OAuth session and preparing repository
                  access. You may need to confirm in your browser.
                </p>

                <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-950">
                  <div className="h-full w-1/3 animate-pulse bg-gradient-to-r from-slate-200 via-slate-400 to-zinc-200" />
                </div>

                <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-300">
                  <span className="inline-flex h-1.5 w-1.5 rounded-full bg-slate-200 animate-bounce" />
                  <span>Step 1 · Verifying your GitHub identity…</span>
                </div>
                <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
                  <span className="inline-flex h-1.5 w-1.5 rounded-full bg-slate-400/70" />
                  <span>Step 2 · Requesting repo &amp; PR permissions…</span>
                </div>
                <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
                  <span className="inline-flex h-1.5 w-1.5 rounded-full bg-slate-500/70" />
                  <span>Step 3 · Linking UR-DEV workspace to GitHub…</span>
                </div>
              </div>

              <p className="mt-4 text-[11px] text-slate-500">
                If nothing happens in a few seconds, check for a GitHub popup
                or a new browser tab asking for authorization.
              </p>
            </>
          )}

          {state === "connected" && (
            <>
              <div className="flex items-start gap-3 rounded-xl border border-emerald-500/40 bg-emerald-900/20 px-4 py-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-400" />
                <div>
                  <div className="text-sm font-semibold text-emerald-100">
                    GitHub connected
                  </div>
                  <p className="mt-1 text-[11px] text-emerald-100/80">
                    Your UR-DEV workspace can now sync with selected
                    repositories for commits, branches, and pull requests.
                  </p>

                  {showAccount && (
                    <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-slate-900/70 px-3 py-1.5 text-[11px] text-slate-100">
                      {showAccount.avatarUrl ? (
                        <img
                          src={showAccount.avatarUrl}
                          alt={showAccount.username}
                          className="h-5 w-5 rounded-full border border-slate-700"
                        />
                      ) : (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-700 text-[9px] uppercase">
                          {showAccount.username.slice(0, 2)}
                        </div>
                      )}
                      <span className="font-medium">
                        @{showAccount.username}
                      </span>
                      <span className="rounded-full bg-emerald-500/20 px-2 py-[1px] text-[10px] text-emerald-300">
                        Active account
                      </span>
                    </div>
                  )}

                  {repo && (
                    <div className="mt-4 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[11px] text-slate-100">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
                            Linked project
                          </span>
                          <button
                            type="button"
                            onClick={handleOpenProjectOnGithub}
                            className="mt-1 inline-flex items-center gap-1 text-[11px] text-sky-200 hover:text-sky-100"
                          >
                            <span>{repo.fullName}</span>
                            <ExternalLink className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleOpenAccountSwitcher}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-[11px] text-slate-100 hover:bg-white/10"
                >
                  <User className="h-3 w-3" />
                  <span>Change account</span>
                </button>
                <button
                  type="button"
                  onClick={handleConnectAnotherAccount}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-transparent px-3 py-1.5 text-[11px] text-slate-100 hover:bg-white/5"
                >
                  <User className="h-3 w-3" />
                  <span>Add another account</span>
                </button>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleManageOnGithub}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-[11px] font-semibold text-slate-900 hover:bg-slate-100"
                >
                  <Github className="h-3 w-3" />
                  <span>Manage on GitHub</span>
                </button>
                {repo && (
                  <button
                    type="button"
                    onClick={handleOpenInVsCode}
                    className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/70 bg-sky-500/15 px-3 py-1.5 text-[11px] text-sky-100 hover:bg-sky-500/25"
                  >
                    <FileCode2 className="h-3 w-3" />
                    <span>Edit in VS Code</span>
                  </button>
                )}
              </div>

              <p className="mt-3 text-[11px] text-slate-500">
                You can pick which repositories UR-DEV is allowed to use from
                your GitHub settings at any time.
              </p>
            </>
          )}

          {state === "connected" && showAccountSwitcher && (
            <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-[#020617]/95">
              <div className="w-full max-w-sm rounded-2xl border border-white/15 bg-slate-950/95 px-4 py-4 shadow-xl">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ArrowLeft
                      className="h-4 w-4 cursor-pointer text-slate-400 hover:text-slate-100"
                      onClick={() => setShowAccountSwitcher(false)}
                    />
                    <h3 className="text-sm font-semibold text-slate-50">
                      Switch GitHub account
                    </h3>
                  </div>
                </div>

                {showAccount && (
                  <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-3">
                    <div className="flex items-center gap-3">
                      {showAccount.avatarUrl ? (
                        <img
                          src={showAccount.avatarUrl}
                          alt={showAccount.username}
                          className="h-8 w-8 rounded-full border border-slate-700"
                        />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-[11px] uppercase text-white">
                          {showAccount.username.slice(0, 2)}
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-slate-50">
                          @{showAccount.username}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Currently connected
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleUseCurrentAccount}
                      className="mt-3 w-full rounded-lg bg-emerald-500 px-3 py-2 text-[11px] font-semibold text-slate-950 hover:bg-emerald-400"
                    >
                      Keep using this account
                    </button>
                  </div>
                )}

                <div className="mt-4 border-t border-white/10 pt-3">
                  <button
                    type="button"
                    onClick={handleConnectAnotherAccount}
                    className="w-full rounded-lg border border-white/15 bg-transparent px-3 py-2 text-[11px] font-semibold text-slate-100 hover:bg-white/5"
                  >
                    Connect another GitHub account
                  </button>
                  <p className="mt-2 text-[10px] text-slate-500">
                    This will reopen the GitHub authorization flow so you can
                    choose a different user or organization.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UrDevGithubModal;
