"use client";

import { useState, useEffect, useCallback } from "react";
import {
  RefreshCw, Check, AlertCircle, User, ChevronRight,
  ExternalLink, Loader2, Info, X, CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  getSyncMeta, saveSyncMeta, verifyUsername,
  buildSyncPreview, applySync, SyncPreview, SyncChange,
} from "@/lib/sync";
import { cn } from "@/lib/utils";

type Step = "idle" | "username" | "verifying" | "preview" | "syncing" | "done" | "error";

const DIFF_COLORS: Record<string, string> = {
  easy: "text-emerald-600 dark:text-emerald-400",
  medium: "text-amber-600 dark:text-amber-400",
  hard: "text-red-600 dark:text-red-400",
};
const STATUS_LABELS: Record<string, string> = {
  todo: "To Do",
  inprogress: "In Progress",
  needs_review: "Needs Review",
  solved: "Solved",
};

interface SyncDialogProps {
  open: boolean;
  onClose: () => void;
  onSyncComplete: () => void;
}

export function SyncDialog({ open, onClose, onSyncComplete }: SyncDialogProps) {
  const [step, setStep] = useState<Step>("idle");
  const [username, setUsername] = useState("");
  const [savedUsername, setSavedUsername] = useState("");
  const [lastSyncAt, setLastSyncAt] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [preview, setPreview] = useState<SyncPreview | null>(null);
  const [result, setResult] = useState<{ problemsUpdated: number; activityDaysAdded: number } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      const meta = getSyncMeta();
      setSavedUsername(meta.username);
      setUsername(meta.username);
      setLastSyncAt(meta.lastSyncAt);
      setStep(meta.username ? "idle" : "username");
    }
  }, [open]);

  const handleVerify = useCallback(async () => {
    if (!username.trim()) return;
    setStep("verifying");
    setError("");
    const check = await verifyUsername(username.trim());
    if (!check.valid) {
      setError(`Username "${username.trim()}" not found on LeetCode, or the profile is set to private.`);
      setStep("username");
      return;
    }
    setDisplayName(check.displayName ?? username.trim());
    saveSyncMeta({ username: username.trim(), lastSyncAt: null });
    setSavedUsername(username.trim());
    // Build preview
    setStep("preview");
    try {
      const p = await buildSyncPreview(username.trim());
      setPreview(p);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch data from LeetCode API.");
      setStep("error");
    }
  }, [username]);

  const handleQuickSync = useCallback(async () => {
    setStep("preview");
    setError("");
    try {
      const p = await buildSyncPreview(savedUsername);
      setPreview(p);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch data from LeetCode API.");
      setStep("error");
    }
  }, [savedUsername]);

  const handleApply = useCallback(async () => {
    setStep("syncing");
    try {
      const res = await applySync(savedUsername);
      setResult(res);
      setLastSyncAt(new Date().toISOString());
      setStep("done");
      onSyncComplete();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sync failed.");
      setStep("error");
    }
  }, [savedUsername, onSyncComplete]);

  const handleClose = () => {
    setStep("idle");
    setPreview(null);
    setResult(null);
    setError("");
    onClose();
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={handleClose}
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="pointer-events-auto w-full max-w-lg rounded-2xl border border-border bg-background shadow-2xl animate-in slide-in-from-bottom-4 duration-300"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-border">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <RefreshCw className="h-4 w-4" />
              </div>
              <div>
                <h2 className="font-semibold text-base">LeetCode Sync</h2>
                {lastSyncAt && (
                  <p className="text-xs text-muted-foreground">
                    Last synced {formatRelative(lastSyncAt)}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={handleClose}
              className="rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">

            {/* ── Step: Idle (username saved, just sync) ── */}
            {step === "idle" && savedUsername && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                    {savedUsername.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{savedUsername}</p>
                    <a
                      href={`https://leetcode.com/${savedUsername}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                    >
                      leetcode.com/{savedUsername}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <button
                    onClick={() => setStep("username")}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Change
                  </button>
                </div>

                <HowItWorks />

                <div className="flex gap-2">
                  <Button className="flex-1 gap-2" onClick={handleQuickSync}>
                    <RefreshCw className="h-4 w-4" />
                    Sync Now
                  </Button>
                  <Button variant="outline" onClick={handleClose}>Cancel</Button>
                </div>
              </div>
            )}

            {/* ── Step: Username input ── */}
            {(step === "username" || step === "verifying") && (
              <div className="space-y-4">
                <HowItWorks />

                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Your LeetCode Username</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        className="pl-9"
                        placeholder="e.g. john_doe"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && handleVerify()}
                        disabled={step === "verifying"}
                        autoFocus
                      />
                    </div>
                    <Button onClick={handleVerify} disabled={!username.trim() || step === "verifying"}>
                      {step === "verifying" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {error && (
                    <p className="text-xs text-destructive flex items-center gap-1.5 mt-1">
                      <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                      {error}
                    </p>
                  )}
                </div>

                <div className="rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30 p-3 text-xs text-amber-800 dark:text-amber-200 flex gap-2">
                  <Info className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                  <span>Your LeetCode profile must be <strong>Public</strong> for sync to work.
                  Check: LeetCode → Settings → Privacy → Public Profile.</span>
                </div>
              </div>
            )}

            {/* ── Step: Loading preview ── */}
            {step === "preview" && !preview && (
              <div className="flex flex-col items-center gap-3 py-8 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <p className="text-sm">Fetching your LeetCode submissions…</p>
                <p className="text-xs opacity-60">This may take a few seconds</p>
              </div>
            )}

            {/* ── Step: Preview ── */}
            {step === "preview" && preview && (
              <div className="space-y-4">
                {/* Summary row */}
                <div className="grid grid-cols-3 gap-3">
                  <SummaryCard
                    label="Will mark solved"
                    value={preview.changes.length}
                    color="text-emerald-600 dark:text-emerald-400"
                  />
                  <SummaryCard
                    label="Already solved"
                    value={preview.alreadySolved}
                    color="text-muted-foreground"
                  />
                  <SummaryCard
                    label="Activity days"
                    value={`+${preview.activityDaysAdded}`}
                    color="text-blue-600 dark:text-blue-400"
                  />
                </div>

                {preview.changes.length === 0 ? (
                  <div className="rounded-xl border border-border bg-muted/20 p-6 text-center">
                    <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                    <p className="font-medium text-sm">Everything is up to date!</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      No new problems to sync from your LeetCode account.
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Problems to mark as Solved
                    </p>
                    <div className="rounded-xl border border-border overflow-hidden">
                      <div className="max-h-52 overflow-y-auto divide-y divide-border">
                        {preview.changes.map(change => (
                          <ChangeRow key={change.problemId} change={change} />
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {preview.notInList > 0 && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Info className="h-3.5 w-3.5 flex-shrink-0" />
                    {preview.notInList} other solved problems on LeetCode are not in your curated list.
                  </p>
                )}

                <div className="flex gap-2">
                  {preview.changes.length > 0 && (
                    <Button className="flex-1 gap-2" onClick={handleApply}>
                      <Check className="h-4 w-4" />
                      Apply Sync
                    </Button>
                  )}
                  <Button variant="outline" onClick={handleClose} className={preview.changes.length === 0 ? "flex-1" : ""}>
                    {preview.changes.length === 0 ? "Close" : "Cancel"}
                  </Button>
                </div>
              </div>
            )}

            {/* ── Step: Syncing ── */}
            {step === "syncing" && (
              <div className="flex flex-col items-center gap-3 py-8 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <p className="text-sm">Applying sync to your tracker…</p>
              </div>
            )}

            {/* ── Step: Done ── */}
            {step === "done" && result && (
              <div className="space-y-4">
                <div className="flex flex-col items-center gap-3 py-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-7 w-7" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-base">Sync Complete!</p>
                    <p className="text-sm text-muted-foreground mt-1">Your tracker is up to date.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <SummaryCard
                    label="Problems updated"
                    value={result.problemsUpdated}
                    color="text-emerald-600 dark:text-emerald-400"
                  />
                  <SummaryCard
                    label="Activity days added"
                    value={result.activityDaysAdded}
                    color="text-blue-600 dark:text-blue-400"
                  />
                </div>

                <Button className="w-full" onClick={handleClose}>Done</Button>
              </div>
            )}

            {/* ── Step: Error ── */}
            {step === "error" && (
              <div className="space-y-4">
                <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 flex gap-3">
                  <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm text-destructive">Sync Failed</p>
                    <p className="text-xs text-muted-foreground mt-1">{error}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  The public API at <code className="bg-muted px-1 rounded text-xs">alfa-leetcode-api.onrender.com</code> may
                  be temporarily unavailable (it's a free hosted service). Try again in a moment.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setStep(savedUsername ? "idle" : "username")}>
                    Try Again
                  </Button>
                  <Button variant="outline" onClick={handleClose}>Close</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function HowItWorks() {
  return (
    <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">How it works</p>
      <ul className="space-y-1.5 text-xs text-muted-foreground">
        <li className="flex items-start gap-2">
          <span className="text-primary mt-0.5">1.</span>
          Fetches your public accepted submissions from LeetCode (no login required)
        </li>
        <li className="flex items-start gap-2">
          <span className="text-primary mt-0.5">2.</span>
          Matches them against your 63 curated problems
        </li>
        <li className="flex items-start gap-2">
          <span className="text-primary mt-0.5">3.</span>
          Updates statuses, solve dates &amp; activity heatmap in your browser
        </li>
        <li className="flex items-start gap-2">
          <span className="text-emerald-500 mt-0.5">✓</span>
          <span>Non-destructive — your notes &amp; custom entries are never overwritten</span>
        </li>
      </ul>
    </div>
  );
}

function SummaryCard({ label, value, color }: { label: string; value: number | string; color: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-3 text-center">
      <div className={cn("text-2xl font-bold", color)}>{value}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}

function ChangeRow({ change }: { change: SyncChange }) {
  return (
    <div className="flex items-center gap-3 px-3 py-2 hover:bg-muted/30 transition-colors">
      <span className={cn("text-xs font-semibold capitalize w-14 flex-shrink-0", DIFF_COLORS[change.difficulty])}>
        {change.difficulty}
      </span>
      <span className="text-sm flex-1 truncate">{change.problemName}</span>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <span className="text-xs text-muted-foreground">{STATUS_LABELS[change.before.status]}</span>
        <ChevronRight className="h-3 w-3 text-muted-foreground" />
        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Solved</span>
      </div>
      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 flex-shrink-0">{change.submissionLang}</Badge>
    </div>
  );
}

function formatRelative(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}
