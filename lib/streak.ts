import { ActivityEntry } from "./types";

export function getCurrentStreak(activity: ActivityEntry[]): number {
  const sorted = [...activity].sort((a, b) => b.date.localeCompare(a.date));
  const today = new Date().toISOString().split("T")[0];
  let streak = 0;
  const cursor = new Date(today);
  for (const entry of sorted) {
    const entryDate = cursor.toISOString().split("T")[0];
    if (entry.date === entryDate) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else break;
  }
  return streak;
}

export function getLongestStreak(activity: ActivityEntry[]): number {
  if (activity.length === 0) return 0;
  let max = 0, current = 0;
  const sorted = [...activity].sort((a, b) => a.date.localeCompare(b.date));
  for (let i = 0; i < sorted.length; i++) {
    if (i === 0) { current = 1; max = 1; continue; }
    const prev = new Date(sorted[i - 1].date);
    prev.setDate(prev.getDate() + 1);
    if (prev.toISOString().split("T")[0] === sorted[i].date) current++;
    else current = 1;
    max = Math.max(max, current);
  }
  return max;
}
