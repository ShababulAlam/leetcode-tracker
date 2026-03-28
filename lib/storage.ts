import { ProblemEntry, ActivityEntry } from "./types";

const PROBLEMS_KEY = "lct_problems";
const ACTIVITY_KEY = "lct_activity";

export function getAllEntries(): ProblemEntry[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(PROBLEMS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function getEntry(id: string): ProblemEntry | null {
  return getAllEntries().find(e => e.id === id) ?? null;
}

export function saveEntry(entry: ProblemEntry): void {
  const all = getAllEntries();
  const idx = all.findIndex(e => e.id === entry.id);
  entry.lastUpdated = new Date().toISOString();
  if (idx >= 0) all[idx] = entry;
  else all.push(entry);
  localStorage.setItem(PROBLEMS_KEY, JSON.stringify(all));
  recordActivity();
}

export function getDefaultEntry(id: string): ProblemEntry {
  return {
    id,
    status: "todo",
    userDifficultyRating: null,
    notes: "",
    solutionCode: "",
    timeTakenMinutes: null,
    dateSolved: null,
    attempts: 0,
    lastUpdated: new Date().toISOString(),
  };
}

function recordActivity(): void {
  const today = new Date().toISOString().split("T")[0];
  const raw = localStorage.getItem(ACTIVITY_KEY);
  const log: ActivityEntry[] = raw ? JSON.parse(raw) : [];
  const idx = log.findIndex(a => a.date === today);
  if (idx >= 0) log[idx].count += 1;
  else log.push({ date: today, count: 1 });
  localStorage.setItem(ACTIVITY_KEY, JSON.stringify(log));
}

export function getActivity(): ActivityEntry[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(ACTIVITY_KEY);
  return raw ? JSON.parse(raw) : [];
}
