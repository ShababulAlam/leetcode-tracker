"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Activity, Target, TrendingUp, Clock, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/status-badge";
import { getUserId } from "@/lib/user";
import { getAllEntries } from "@/lib/storage";
import { PROBLEMS } from "@/lib/problems";
import { ProblemEntry } from "@/lib/types";
import { cn } from "@/lib/utils";

// Vercel best practice: lazy state initializer to avoid redundant localStorage reads
function loadEntries(): ProblemEntry[] {
  return getAllEntries();
}

const TOPICS = [...new Set(PROBLEMS.map(p => p.topic))];

export default function Dashboard() {
  const [userId, setUserId] = useState("");
  const [entries, setEntries] = useState<ProblemEntry[]>(loadEntries);

  useEffect(() => {
    setUserId(getUserId());
  }, []);

  // Vercel best practice: derive state during render, not in effects
  const entryMap = new Map(entries.map(e => [e.id, e]));
  const solved = entries.filter(e => e.status === "solved").length;
  const inProgress = entries.filter(e => e.status === "inprogress").length;
  const needsReview = entries.filter(e => e.status === "needs_review").length;
  const total = PROBLEMS.length;
  const pct = total > 0 ? Math.round((solved / total) * 100) : 0;

  const topicProgress = TOPICS.map(topic => {
    const tp = PROBLEMS.filter(p => p.topic === topic);
    const ts = tp.filter(p => entryMap.get(p.id)?.status === "solved").length;
    return { topic, solved: ts, total: tp.length };
  });

  const difficultyProgress = (["easy", "medium", "hard"] as const).map(diff => {
    const dp = PROBLEMS.filter(p => p.difficulty === diff);
    const ds = dp.filter(p => entryMap.get(p.id)?.status === "solved").length;
    return { diff, solved: ds, total: dp.length };
  });

  const recentlyUpdated = [...entries]
    .sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated))
    .slice(0, 5)
    .flatMap(entry => {
      const problem = PROBLEMS.find(p => p.id === entry.id);
      return problem ? [{ entry, problem }] : [];
    });

  const statCards = [
    {
      label: "Total Problems",
      value: total,
      icon: BookOpen,
      accent: "card-accent-slate",
      valueClass: "text-foreground",
    },
    {
      label: "Solved",
      value: solved,
      icon: Target,
      accent: "card-accent-emerald",
      valueClass: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "In Progress",
      value: inProgress,
      icon: TrendingUp,
      accent: "card-accent-blue",
      valueClass: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "Needs Review",
      value: needsReview,
      icon: AlertCircle,
      accent: "card-accent-amber",
      valueClass: "text-amber-600 dark:text-amber-400",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="fade-in">
        <h1 className="text-3xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-muted-foreground text-sm mt-1.5 flex items-center gap-1.5">
          Session ID:
          <code className="font-mono text-xs bg-muted border border-border px-1.5 py-0.5 rounded text-muted-foreground">
            {userId || "loading..."}
          </code>
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 fade-in fade-in-delay-1">
        {statCards.map(({ label, value, icon: Icon, accent, valueClass }) => (
          <Card key={label} className={cn("overflow-hidden transition-shadow hover:shadow-md", accent)}>
            <CardHeader className="pb-1 pt-4 px-4">
              <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 uppercase tracking-wide">
                <Icon className="h-3.5 w-3.5" />
                {label}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className={cn("text-3xl font-bold", valueClass)}>{value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Overall Progress */}
      <Card className="fade-in fade-in-delay-2">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Overall Progress</CardTitle>
            <span className="text-2xl font-bold text-primary">{pct}%</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <Progress value={pct} className="h-2.5 rounded-full" />
          <p className="text-xs text-muted-foreground">{solved} of {total} problems solved</p>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 fade-in fade-in-delay-3">
        {/* Progress by Topic */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">By Topic</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topicProgress.map(({ topic, solved, total }) => (
              <div key={topic} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium">{topic}</span>
                  <span className="text-muted-foreground tabular-nums">{solved}/{total}</span>
                </div>
                <Progress value={total > 0 ? (solved / total) * 100 : 0} className="h-1.5 rounded-full" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Progress by Difficulty */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">By Difficulty</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {difficultyProgress.map(({ diff, solved, total }) => {
              const diffStyle = {
                easy: "text-emerald-600 dark:text-emerald-400",
                medium: "text-amber-600 dark:text-amber-400",
                hard: "text-red-600 dark:text-red-400",
              }[diff];
              return (
                <div key={diff} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className={cn("font-semibold capitalize", diffStyle)}>{diff}</span>
                    <span className="text-muted-foreground tabular-nums">{solved}/{total}</span>
                  </div>
                  <Progress value={total > 0 ? (solved / total) * 100 : 0} className="h-2 rounded-full" />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Recently Updated */}
      {recentlyUpdated.length > 0 && (
        <Card className="fade-in fade-in-delay-4">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                Recently Updated
              </CardTitle>
              <Link href="/problems" className="text-xs text-primary hover:underline flex items-center gap-0.5">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="divide-y divide-border">
            {recentlyUpdated.map(({ entry, problem }) => (
              <div key={entry.id} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                <Link
                  href={`/problems/${entry.id}`}
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  {problem.name}
                </Link>
                <StatusBadge status={entry.status} />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Quick Links */}
      <div className="flex gap-3 fade-in fade-in-delay-4">
        <Link
          href="/problems"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <BookOpen className="h-4 w-4" />
          Browse Problems
        </Link>
        <Link
          href="/activity"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"
        >
          <Activity className="h-4 w-4" />
          View Activity
        </Link>
      </div>
    </div>
  );
}
