import { PROBLEMS } from "./problems";
import { getAllEntries, saveEntry, getActivity, getDefaultEntry } from "./storage";
import { ProblemEntry, ActivityEntry } from "./types";

const API_BASE = "https://alfa-leetcode-api.onrender.com";

const META_KEY = "lct_sync_meta";
const ACTIVITY_KEY = "lct_activity";

// ─── Meta (username + last sync timestamp) ───────────────────────────────────

export interface SyncMeta {
  username: string;
  lastSyncAt: string | null;
}

export function getSyncMeta(): SyncMeta {
  if (typeof window === "undefined") return { username: "", lastSyncAt: null };
  const raw = localStorage.getItem(META_KEY);
  return raw ? JSON.parse(raw) : { username: "", lastSyncAt: null };
}

export function saveSyncMeta(meta: SyncMeta): void {
  localStorage.setItem(META_KEY, JSON.stringify(meta));
}

// ─── API fetch helpers ────────────────────────────────────────────────────────

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`API error ${res.status}: ${res.statusText}`);
  return res.json();
}

// Accepted submissions (up to 500 — max the API allows reasonably)
interface AcSubmission {
  title: string;
  titleSlug: string;
  timestamp: string; // Unix seconds as string
  statusDisplay: string;
  lang: string;
}
interface AcSubmissionResponse {
  count: number;
  submission: AcSubmission[];
}

// Calendar response
interface CalendarResponse {
  activeYears: number[];
  streak: number;
  totalActiveDays: number;
  submissionCalendar: string; // JSON string: { "unixTimestamp": count, ... }
}

export async function fetchAcSubmissions(username: string): Promise<AcSubmission[]> {
  const data = await fetchJson<AcSubmissionResponse>(
    `/${encodeURIComponent(username)}/acSubmission?limit=500`
  );
  return data.submission ?? [];
}

export async function fetchCalendar(username: string): Promise<CalendarResponse> {
  return fetchJson<CalendarResponse>(`/${encodeURIComponent(username)}/calendar`);
}

export async function verifyUsername(username: string): Promise<{ valid: boolean; displayName?: string }> {
  try {
    const data = await fetchJson<{ username?: string; name?: string; errors?: unknown }>(
      `/${encodeURIComponent(username)}`
    );
    if (data.errors || !data.username) return { valid: false };
    return { valid: true, displayName: data.name || data.username };
  } catch {
    return { valid: false };
  }
}

// ─── Sync diff types ─────────────────────────────────────────────────────────

export interface SyncChange {
  problemId: string;
  problemName: string;
  difficulty: string;
  before: {
    status: string;
    dateSolved: string | null;
  };
  after: {
    status: "solved";
    dateSolved: string;
  };
  submissionLang: string;
}

export interface SyncPreview {
  changes: SyncChange[];
  alreadySolved: number;       // problems already marked solved locally
  notInList: number;           // LC solved problems not in our 63-problem list
  activityDaysAdded: number;   // new activity days from LeetCode calendar
}

// ─── Core sync logic ─────────────────────────────────────────────────────────

/**
 * Build a preview diff — what WOULD change if we apply the sync.
 * Does NOT write to localStorage.
 */
export async function buildSyncPreview(username: string): Promise<SyncPreview> {
  const [submissions, calendar] = await Promise.all([
    fetchAcSubmissions(username),
    fetchCalendar(username).catch(() => null),
  ]);

  const entries = getAllEntries();
  const entryMap = new Map(entries.map(e => [e.id, e]));

  // Build a map: titleSlug → earliest accepted submission
  // (earliest = first time they solved it)
  const solvedMap = new Map<string, AcSubmission>();
  for (const sub of submissions) {
    const existing = solvedMap.get(sub.titleSlug);
    if (!existing || Number(sub.timestamp) < Number(existing.timestamp)) {
      solvedMap.set(sub.titleSlug, sub);
    }
  }

  const changes: SyncChange[] = [];
  let alreadySolved = 0;
  let notInList = 0;

  // Check each of our 63 problems against the submission map
  for (const problem of PROBLEMS) {
    const submission = solvedMap.get(problem.id);
    if (!submission) continue;

    const entry = entryMap.get(problem.id);
    const currentStatus = entry?.status ?? "todo";

    if (currentStatus === "solved") {
      alreadySolved++;
      continue;
    }

    const dateSolved = new Date(Number(submission.timestamp) * 1000)
      .toISOString()
      .split("T")[0];

    changes.push({
      problemId: problem.id,
      problemName: problem.name,
      difficulty: problem.difficulty,
      before: { status: currentStatus, dateSolved: entry?.dateSolved ?? null },
      after: { status: "solved", dateSolved },
      submissionLang: submission.lang,
    });
  }

  // How many LC solved problems are NOT in our curated list
  const ourSlugs = new Set(PROBLEMS.map(p => p.id));
  for (const slug of solvedMap.keys()) {
    if (!ourSlugs.has(slug)) notInList++;
  }

  // Activity days that would be added
  let activityDaysAdded = 0;
  if (calendar?.submissionCalendar) {
    activityDaysAdded = countNewActivityDays(calendar.submissionCalendar);
  }

  return { changes, alreadySolved, notInList, activityDaysAdded };
}

/**
 * Apply the sync — writes to localStorage.
 * Returns count of problems updated.
 */
export async function applySync(username: string): Promise<{
  problemsUpdated: number;
  activityDaysAdded: number;
}> {
  const [submissions, calendar] = await Promise.all([
    fetchAcSubmissions(username),
    fetchCalendar(username).catch(() => null),
  ]);

  const entries = getAllEntries();
  const entryMap = new Map(entries.map(e => [e.id, e]));

  // Earliest accepted submission per slug
  const solvedMap = new Map<string, AcSubmission>();
  for (const sub of submissions) {
    const existing = solvedMap.get(sub.titleSlug);
    if (!existing || Number(sub.timestamp) < Number(existing.timestamp)) {
      solvedMap.set(sub.titleSlug, sub);
    }
  }

  let problemsUpdated = 0;

  for (const problem of PROBLEMS) {
    const submission = solvedMap.get(problem.id);
    if (!submission) continue;

    const entry = entryMap.get(problem.id) ?? getDefaultEntry(problem.id);
    if (entry.status === "solved") continue; // never downgrade

    const dateSolved = new Date(Number(submission.timestamp) * 1000)
      .toISOString()
      .split("T")[0];

    const updated: ProblemEntry = {
      ...entry,
      status: "solved",
      dateSolved,
      // Preserve existing attempts; ensure at least 1
      attempts: Math.max(entry.attempts, 1),
      lastUpdated: new Date().toISOString(),
    };

    saveEntry(updated);
    problemsUpdated++;
  }

  // Merge activity calendar from LeetCode
  let activityDaysAdded = 0;
  if (calendar?.submissionCalendar) {
    activityDaysAdded = mergeActivityCalendar(calendar.submissionCalendar);
  }

  // Save sync metadata
  saveSyncMeta({ username, lastSyncAt: new Date().toISOString() });

  return { problemsUpdated, activityDaysAdded };
}

// ─── Activity helpers ─────────────────────────────────────────────────────────

function countNewActivityDays(submissionCalendarJson: string): number {
  const existing = getActivity();
  const existingDates = new Set(existing.map(e => e.date));

  const calendar: Record<string, number> = JSON.parse(submissionCalendarJson);
  let count = 0;
  for (const ts of Object.keys(calendar)) {
    const date = new Date(Number(ts) * 1000).toISOString().split("T")[0];
    if (!existingDates.has(date)) count++;
  }
  return count;
}

function mergeActivityCalendar(submissionCalendarJson: string): number {
  const existing = getActivity();
  const activityMap = new Map(existing.map(e => [e.date, e.count]));

  const calendar: Record<string, number> = JSON.parse(submissionCalendarJson);
  let added = 0;

  for (const [ts, count] of Object.entries(calendar)) {
    const date = new Date(Number(ts) * 1000).toISOString().split("T")[0];
    if (!activityMap.has(date)) {
      activityMap.set(date, count);
      added++;
    }
    // Don't overwrite existing local activity — local data takes priority
  }

  const merged: ActivityEntry[] = Array.from(activityMap.entries()).map(
    ([date, count]) => ({ date, count })
  );

  localStorage.setItem(ACTIVITY_KEY, JSON.stringify(merged));
  return added;
}
