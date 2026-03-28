"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ExternalLink, Star, Check, ChevronLeft, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PROBLEMS } from "@/lib/problems";
import { getEntry, saveEntry, getDefaultEntry } from "@/lib/storage";
import { ProblemEntry, Status, Difficulty } from "@/lib/types";
import { cn } from "@/lib/utils";
import { format, formatDistanceToNow } from "date-fns";

const DIFF_STYLES: Record<Difficulty, string> = {
  easy: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
  medium: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
  hard: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800",
};

export default function ProblemDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const problem = PROBLEMS.find(p => p.id === id);

  const [entry, setEntry] = useState<ProblemEntry | null>(null);
  const [saved, setSaved] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  // Vercel best practice: use ref for transient timer to avoid re-renders
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!id) return;
    setEntry(getEntry(id) ?? getDefaultEntry(id));
  }, [id]);

  const scheduleSave = useCallback((updatedEntry: ProblemEntry) => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveEntry(updatedEntry);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 500);
  }, []);

  const update = useCallback((changes: Partial<ProblemEntry>) => {
    setEntry(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ...changes };
      scheduleSave(updated);
      return updated;
    });
  }, [scheduleSave]);

  if (!problem) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <p className="text-lg font-medium">Problem not found</p>
        <Link href="/problems" className="text-sm text-primary hover:underline mt-2 inline-block">← Back to problems</Link>
      </div>
    );
  }
  if (!entry) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6 fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/problems" className="flex items-center gap-1 hover:text-foreground transition-colors">
          <ChevronLeft className="h-3.5 w-3.5" />
          Problems
        </Link>
        <span className="opacity-40">/</span>
        <span className="text-foreground font-medium truncate">{problem.name}</span>
      </div>

      {/* Problem Header */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-3">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-semibold tracking-tight leading-tight">{problem.name}</h1>
          <a href={problem.leetcodeUrl} target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
            <Button variant="outline" size="sm" className="gap-1.5">
              <ExternalLink className="h-3.5 w-3.5" />
              LeetCode
            </Button>
          </a>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className={cn("inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize", DIFF_STYLES[problem.difficulty])}>
            {problem.difficulty}
          </span>
          <Badge variant="secondary" className="text-xs">{problem.topic}</Badge>
          <Badge variant="outline" className="text-xs">{problem.pattern}</Badge>
          <Badge variant="outline" className="text-xs text-muted-foreground">{problem.frequency}</Badge>
        </div>
      </div>

      {/* Tracking Form */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Tracking</h2>
          {saved && (
            <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 animate-in fade-in duration-200">
              <Check className="h-3 w-3" /> Saved
            </span>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {/* Status */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Status</label>
            <Select value={entry.status} onValueChange={v => v && update({ status: v as Status })}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="inprogress">In Progress</SelectItem>
                <SelectItem value="solved">Solved</SelectItem>
                <SelectItem value="needs_review">Needs Review</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Time Taken */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Time Taken</label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={entry.timeTakenMinutes ?? ""}
                onChange={e => update({ timeTakenMinutes: e.target.value ? parseInt(e.target.value) : null })}
                className="flex-1"
                placeholder="0"
                min={0}
              />
              <span className="text-sm text-muted-foreground whitespace-nowrap">min</span>
            </div>
          </div>

          {/* Attempts */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Attempts</label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 flex-shrink-0"
                onClick={() => update({ attempts: Math.max(0, entry.attempts - 1) })}
              >
                −
              </Button>
              <Input
                type="number"
                value={entry.attempts}
                onChange={e => update({ attempts: parseInt(e.target.value) || 0 })}
                className="text-center"
                min={0}
              />
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 flex-shrink-0"
                onClick={() => update({ attempts: entry.attempts + 1 })}
              >
                +
              </Button>
            </div>
          </div>

          {/* Date Solved */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Date Solved</label>
            <Popover>
              <PopoverTrigger
                className={cn(
                  "inline-flex w-full items-center gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                  entry.dateSolved ? "text-foreground" : "text-muted-foreground"
                )}
              >
                <CalendarIcon className="h-4 w-4 opacity-50 flex-shrink-0" />
                <span className="flex-1 text-left">
                  {entry.dateSolved ? format(new Date(entry.dateSolved), "PPP") : "Pick a date"}
                </span>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" side="bottom" align="start">
                <Calendar
                  mode="single"
                  selected={entry.dateSolved ? new Date(entry.dateSolved) : undefined}
                  onSelect={date => update({
                    dateSolved: date ? date.toISOString().split("T")[0] : null,
                    ...(date ? { status: "solved" } : {}),
                  })}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Difficulty Rating */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Your Difficulty Rating</label>
          <div
            className="flex gap-1"
            onMouseLeave={() => setHoverRating(0)}
          >
            {[1, 2, 3, 4, 5].map(star => {
              const filled = star <= (hoverRating || entry.userDifficultyRating || 0);
              return (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onClick={() => update({
                    userDifficultyRating: entry.userDifficultyRating === star ? null : star as 1|2|3|4|5
                  })}
                  className={cn(
                    "transition-all duration-100 hover:scale-110 focus:outline-none",
                    filled ? "text-amber-400" : "text-border"
                  )}
                >
                  <Star className="h-6 w-6 fill-current" />
                </button>
              );
            })}
            {(hoverRating > 0 || entry.userDifficultyRating) && (
              <span className="text-xs text-muted-foreground self-center ml-2">
                {hoverRating || entry.userDifficultyRating}/5
              </span>
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Personal Notes</label>
          <Textarea
            value={entry.notes}
            onChange={e => update({ notes: e.target.value })}
            placeholder="What did you learn? What tripped you up?"
            className="resize-none"
            rows={4}
          />
        </div>

        {/* Solution Code */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Solution Code</label>
            <span className="text-xs text-muted-foreground font-mono">paste your solution</span>
          </div>
          <Textarea
            value={entry.solutionCode}
            onChange={e => update({ solutionCode: e.target.value })}
            placeholder="// paste your solution here..."
            className="font-mono text-sm resize-none bg-muted/30"
            rows={12}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="text-xs text-muted-foreground text-right pb-4">
        Last updated {formatDistanceToNow(new Date(entry.lastUpdated), { addSuffix: true })}
      </div>
    </div>
  );
}
