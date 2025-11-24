import React, { useState, useEffect } from "react";
import {
  Github,
  X,
  CheckCircle2,
  User,
  ArrowLeft,
  ExternalLink,
  FileCode2,
  Loader2,
} from "lucide-react";

// Types
type GithubState = "idle" | "connecting" | "connected";

interface GithubAccount {
  username: string;
  avatarUrl?: string;
}

interface GithubRepo {
  name: string;
  fullName: string;
  url: string;
}

interface UrDevGithubModalProps {
  connectedAccount?: GithubAccount;
  connectedRepo?: GithubRepo;
  onClose?: () => void;
}

function UrDevGithubModal({
  connectedAccount,
  connectedRepo,
  onClose,
}: UrDevGithubModalProps) {
  const hasAccount = !!connectedAccount;
  const hasRepo = !!connectedRepo;

  const initialState: GithubState = hasAccount
    ? hasRepo
      ? "connected"
      : "idle"
    : "idle";

  const [state, setState] = useState<GithubState>(initialState);
  const [activeAccount, setActiveAccount] = useState<GithubAccount | undefined>(
    connectedAccount
  );
  const [showAccountSwitcher, setShowAccountSwitcher] = useState(false);

  const [localRepo, setLocalRepo] = useState<GithubRepo | undefined>(
    connectedRepo
  );
  const [repoFullNameInput, setRepoFullNameInput] = useState<string>(
    connectedRepo?.fullName ?? ""
  );
  const [repoUrlInput, setRepoUrlInput] = useState<string>(
    connectedRepo?.url ?? ""
  );

  useEffect(() => {
    const hasAccountNow = !!connectedAccount;
    const hasRepoNow = !!connectedRepo;

    if (hasAccountNow) {
      setActiveAccount(connectedAccount);
    } else {
      setActiveAccount(undefined);
    }

    if (hasRepoNow && connectedRepo) {
      setLocalRepo(connectedRepo);
      setRepoFullNameInput(connectedRepo.fullName);
      setRepoUrlInput(connectedRepo.url);
    } else if (!hasRepoNow) {
      setLocalRepo(undefined);
      setRepoFullNameInput("");
      setRepoUrlInput("");
    }

    const nextState: GithubState = hasAccountNow
      ? hasRepoNow
        ? "connected"
        : "idle"
      : "idle";

    setState(nextState);
  }, [connectedAccount, connectedRepo]);

  function runConnectionFlow() {
    setState("connecting");

    setTimeout(() => {
      const newAccount: GithubAccount = {
        username: activeAccount?.username || "ur-dev-user",
        avatarUrl:
          activeAccount?.avatarUrl ||
          "https://avatars.githubusercontent.com/u/9919?v=4",
      };

      const newRepo: GithubRepo = {
        name: "ur-dev-project",
        fullName: "AlbQuantum/ur-dev-project",
        url: "https://github.com/AlbQuantum/ur-dev-project",
      };

      setActiveAccount(newAccount);
      setLocalRepo((prev) => prev || newRepo);
      setRepoFullNameInput((prev) => prev || newRepo.fullName);
      setRepoUrlInput((prev) => prev || newRepo.url);
      setState("connected");
    }, 1200);
  }

  function handleConnect() {
    if (state === "connecting") return;
    runConnectionFlow();
  }

  function handleClose() {
    if (onClose) {
      onClose();
    }
  }

  function handleOpenAccountSwitcher() {
    setShowAccountSwitcher(true);
  }

  function handleUseCurrentAccount() {
    setShowAccountSwitcher(false);
    runConnectionFlow();
  }

  function handleConnectAnotherAccount() {
    setShowAccountSwitcher(false);
    setState("idle");
    setActiveAccount(undefined);
    setLocalRepo(undefined);
    setRepoFullNameInput("");
    setRepoUrlInput("");
  }

  function handleManageOnGithub() {
    if (typeof window === "undefined") return;
    window.open(
      "https://github.com/settings/installations",
      "_blank",
      "noopener,noreferrer"
    );
  }

  const showAccount =
    (state === "connected" && activeAccount) || activeAccount || null;
  const repo = state === "connected" ? connectedRepo ?? localRepo : null;

  function handleOpenProjectOnGithub() {
    if (!repo || typeof window === "undefined") return;
    window.open(repo.url, "_blank", "noopener,noreferrer");
  }

  function handleOpenInVsCode() {
    if (!repo || typeof window === "undefined") return;
    const vsCodeUrl = `https://github.dev/${repo.fullName}`;
    window.open(vsCodeUrl, "_blank", "noopener,noreferrer");
  }

  function handleAutoSaveRepo() {
    const fullName = repoFullNameInput.trim();
    if (!fullName) return;

    const url = repoUrlInput.trim() || `https://github.com/${fullName}`;
    const name = fullName.split("/").slice(-1)[0];

    setLocalRepo({ name, fullName, url });
  }

  const connectButtonLabel =
    state === "connecting"
      ? "Connecting to GitHub…"
      : activeAccount
      ? "Use this account for this project"
      : "Connect with GitHub";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-2xl border border-white/15 bg-[#020617] shadow-[0_0_55px_rgba(15,23,42,0.95)]">
        {/* Header */}
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

        {/* Body */}
        <div className="relative px-6 py-5">
          {(state === "idle" || state === "connecting") && (
            <>
              {activeAccount && (
                <div className="mb-4 rounded-xl border border-emerald-500/40 bg-emerald-900/15 px-3 py-3">
                  <div className="flex items-center gap-3">
                    {activeAccount.avatarUrl ? (
                      <img
                        src={activeAccount.avatarUrl}
                        alt={activeAccount.username}
                        className="h-7 w-7 rounded-full border border-slate-700"
                      />
                    ) : (
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-700 text-[10px] uppercase text-white">
                        {activeAccount.username.slice(0, 2)}
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-slate-50">
                        @{activeAccount.username}
                      </span>
                      <span className="text-[10px] text-emerald-300">
                        GitHub account already connected – use it instantly for
                        this UR-DEV project.
                      </span>
                    </div>
                  </div>

                  {/* MAIN BUTTON VISIBLE IN FIRST WINDOW */}
                  <button
                    type="button"
                    onClick={handleConnect}
                    disabled={state === "connecting"}
                    className={`mt-3 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-[11px] font-semibold shadow-[0_0_20px_rgba(16,185,129,0.55)] ${
                      state === "connecting"
                        ? "bg-emerald-300 text-emerald-900 opacity-95"
                        : "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                    }`}
                  >
                    <Github className="h-3.5 w-3.5" />
                    <span>{connectButtonLabel}</span>
                    {state === "connecting" && (
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-900" />
                    )}
                  </button>
                </div>
              )}

              <p className="text-sm text-slate-200">
                Connect GitHub to sync branches, open pull requests, and keep
                your generated code in a real repository you fully control.
              </p>

              <ul className="mt-4 space-y-1 text-[12px] text-slate-300">
                <li>• Link one or more GitHub accounts or organizations.</li>
                <li>• Push UR-DEV changes directly to your repos.</li>
                <li>• Auto-open PRs for larger edits with clear diffs.</li>
              </ul>

              {/* Fallback button when there is NO existing account */}
              {!activeAccount && (
                <button
                  type="button"
                  onClick={handleConnect}
                  disabled={state === "connecting"}
                  className={`mt-6 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold shadow-[0_0_26px_rgba(255,255,255,0.35)] ${
                    state === "connecting"
                      ? "bg-slate-200 text-slate-800 opacity-90"
                      : "bg-white text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Github className="h-4 w-4" />
                  <span>{connectButtonLabel}</span>
                  {state === "connecting" && (
                    <Loader2 className="h-4 w-4 animate-spin text-slate-700" />
                  )}
                </button>
              )}

              <p className="mt-3 text-[11px] text-slate-500">
                When an account is already connected, UR-DEV shows a short
                circle animation in this button. Once done, the modal switches
                to a green "GitHub connected" state with a check mark.
              </p>
            </>
          )}

          {state === "connected" && (
            <>
              <div className="flex items-start gap-3 rounded-xl border border-emerald-500/40 bg-emerald-900/20 px-4 py-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-400" />
                <div className="flex-1">
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
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-[1px] text-[10px] text-emerald-300">
                        <CheckCircle2 className="h-3 w-3" />
                        Connected
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-[11px] text-slate-100">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
                      Linked project
                    </span>
                    {repo ? (
                      <button
                        type="button"
                        onClick={handleOpenProjectOnGithub}
                        className="mt-1 inline-flex items-center gap-1 text-[11px] text-sky-200 hover:text-sky-100"
                      >
                        <span>{repo.fullName}</span>
                        <ExternalLink className="h-3 w-3" />
                      </button>
                    ) : (
                      <span className="mt-1 text-[10px] text-slate-400">
                        This project is not linked to a repository yet. Add one
                        below.
                      </span>
                    )}
                  </div>
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

                <div className="mt-3">
                  <label className="block text-[10px] text-slate-300">
                    Repository (owner/name)
                  </label>
                  <input
                    value={repoFullNameInput}
                    onChange={(e) => setRepoFullNameInput(e.target.value)}
                    onBlur={handleAutoSaveRepo}
                    placeholder="AlbQuantum/ur-dev-web"
                    className="mt-1 w-full rounded-md border border-white/15 bg-slate-900 px-2 py-1.5 text-[11px] text-slate-100 outline-none ring-0 focus:border-sky-400"
                  />
                </div>
                <div className="mt-2">
                  <label className="block text-[10px] text-slate-300">
                    GitHub URL (optional)
                  </label>
                  <input
                    value={repoUrlInput}
                    onChange={(e) => setRepoUrlInput(e.target.value)}
                    onBlur={handleAutoSaveRepo}
                    placeholder="https://github.com/AlbQuantum/ur-dev-web"
                    className="mt-1 w-full rounded-md border border-white/15 bg-slate-900 px-2 py-1.5 text-[11px] text-slate-100 outline-none ring-0 focus:border-sky-400"
                  />
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
                  onClick={handleManageOnGithub}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-[11px] font-semibold text-slate-900 hover:bg-slate-100"
                >
                  <Github className="h-3 w-3" />
                  <span>Manage on GitHub</span>
                </button>
              </div>

              <div className="mt-3 border-t border-white/10 pt-3">
                <button
                  type="button"
                  onClick={handleConnectAnotherAccount}
                  className="w-full rounded-lg border border-white/20 bg-transparent px-3 py-2 text-[11px] font-semibold text-slate-100 hover:bg-white/5"
                >
                  Connect another GitHub account
                </button>
                <p className="mt-2 text-[11px] text-slate-500">
                  This will reopen the GitHub authorization flow so you can link
                  a different user or organization.
                </p>
              </div>
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
                      Use this account for this project
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