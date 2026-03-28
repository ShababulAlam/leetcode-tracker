"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Flame, TrendingUp, CalendarDays, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getActivity } from "@/lib/storage";
import { getCurrentStreak, getLongestStreak } from "@/lib/streak";
import { ActivityEntry } from "@/lib/types";
import { cn } from "@/lib/utils";

// ── Layout constants ──────────────────────────────────────────────────────────
const CELL = 13;            // cell size in px
const GAP  = 3;             // gap between cells / columns in px
const SLOT = CELL + GAP;    // 16px per column slot
const DAY_COL_W   = 20;     // width of the day-label column
const DAY_COL_GAP = 6;      // gap between day-label column and the week grid

// ── Data helpers ──────────────────────────────────────────────────────────────
function loadActivity(): ActivityEntry[] {
  return getActivity();
}

/** Generate the full 52-ish weeks ending today. */
function generateAllWeeks(): { date: string }[][] {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 364);
  // Snap back to Sunday so every week starts on Sunday
  startDate.setDate(startDate.getDate() - startDate.getDay());

  const weeks: { date: string }[][] = [];
  const cursor = new Date(startDate);

  while (cursor <= today) {
    const week: { date: string }[] = [];
    for (let d = 0; d < 7; d++) {
      week.push({ date: cursor.toISOString().split("T")[0] });
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}

const ALL_WEEKS = generateAllWeeks();

/** Intensity colour classes for a cell. */
function getIntensityClass(count: number): string {
  if (count === 0) return "bg-border/60 dark:bg-muted/40";
  if (count === 1) return "bg-emerald-200 dark:bg-emerald-900";
  if (count <= 3) return "bg-emerald-400 dark:bg-emerald-700";
  return "bg-emerald-600 dark:bg-emerald-500";
}

/**
 * Compute month-label positions for a given (possibly trimmed) week array.
 * Returns positions relative to week index 0 of `weeks`.
 * Uses "Jan '26" format for January so year transitions are clear.
 */
function getMonthLabels(
  weeks: { date: string }[][]
): { label: string; weekIndex: number }[] {
  const labels: { label: string; weekIndex: number }[] = [];
  const MIN_GAP = 3; // minimum weeks between labels to prevent overlap
  let lastLabelWeek = -MIN_GAP;
  let prevMonth = -1;

  weeks.forEach((week, i) => {
    // Noon UTC avoids DST-induced date shifts at month boundaries
    const d = new Date(week[0].date + "T12:00:00");
    const month = d.getMonth();
    if (month !== prevMonth) {
      if (i - lastLabelWeek >= MIN_GAP) {
        const label =
          month === 0
            ? `Jan '${d.getFullYear().toString().slice(2)}`
            : d.toLocaleString("default", { month: "short" });
        labels.push({ label, weekIndex: i });
        lastLabelWeek = i;
      }
      prevMonth = month;
    }
  });
  return labels;
}

// Sun/Mon/Tue/Wed/Thu/Fri/Sat — show M, W, F only (indices 1, 3, 5)
const DAY_LABELS = ["", "M", "", "W", "", "F", ""];

// ── Component ─────────────────────────────────────────────────────────────────
export default function ActivityPage() {
  const [activityData] = useState<ActivityEntry[]>(loadActivity);

  // Measure the card's inner content width so we know how many weeks fit.
  const containerRef = useRef<HTMLDivElement>(null);
  // Start with a reasonable guess (600px ≈ 36 visible weeks) to avoid an
  // empty-grid flash before ResizeObserver fires on mount.
  const [containerWidth, setContainerWidth] = useState(600);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      setContainerWidth(entries[0].contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Slice to the most-recent N weeks that fit the measured width — no scroll.
  const visibleWeeks = useMemo(() => {
    const available = containerWidth - DAY_COL_W - DAY_COL_GAP;
    const n = Math.max(8, Math.min(Math.floor(available / SLOT), ALL_WEEKS.length));
    return ALL_WEEKS.slice(ALL_WEEKS.length - n);
  }, [containerWidth]);

  const monthLabels = useMemo(() => getMonthLabels(visibleWeeks), [visibleWeeks]);

  const activityMap = useMemo(() => {
    const map: Record<string, number> = {};
    activityData.forEach(e => { map[e.date] = e.count; });
    return map;
  }, [activityData]);

  const currentStreak  = getCurrentStreak(activityData);
  const longestStreak  = getLongestStreak(activityData);
  const totalActiveDays = activityData.length;
  const totalUpdates   = activityData.reduce((sum, e) => sum + e.count, 0);
  const todayStr = new Date().toISOString().split("T")[0];

  // Exact pixel width of the rendered week grid (no trailing gap on last column)
  const gridWidth = visibleWeeks.length * SLOT - GAP;

  const monthlyData = useMemo(() => {
    const map: Record<string, number> = {};
    activityData.forEach(e => {
      const month = e.date.slice(0, 7);
      map[month] = (map[month] ?? 0) + e.count;
    });
    return Object.entries(map).sort((a, b) => a[0].localeCompare(b[0])).slice(-12);
  }, [activityData]);

  const maxMonthly = Math.max(...monthlyData.map(([, c]) => c), 1);

  const statCards = [
    { label: "Current Streak",  value: currentStreak,    unit: "days", icon: Flame,        accent: "text-orange-500",      accent2: "card-accent-amber"   },
    { label: "Longest Streak",  value: longestStreak,    unit: "days", icon: TrendingUp,   accent: "text-primary",          accent2: "card-accent-emerald" },
    { label: "Active Days",     value: totalActiveDays,  unit: null,   icon: CalendarDays, accent: "text-blue-500",         accent2: "card-accent-blue"    },
    { label: "Total Updates",   value: totalUpdates,     unit: null,   icon: Zap,          accent: "text-muted-foreground", accent2: "card-accent-slate"   },
  ];

  return (
    <div className="space-y-8 fade-in">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Activity</h1>
        <p className="text-sm text-muted-foreground mt-1">Your coding consistency over the past year</p>
      </div>

      {/* ── Streak stat cards ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 fade-in-delay-1">
        {statCards.map(({ label, value, unit, icon: Icon, accent, accent2 }) => (
          <Card key={label} className={cn("overflow-hidden transition-shadow hover:shadow-md", accent2)}>
            <CardHeader className="pb-1 pt-4 px-4">
              <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 uppercase tracking-wide">
                <Icon className={cn("h-3.5 w-3.5", accent)} />
                {label}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="text-3xl font-bold">
                {value}
                {unit && <span className="text-sm font-normal text-muted-foreground ml-1">{unit}</span>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Heatmap card ──────────────────────────────────────────────────── */}
      <Card className="fade-in-delay-2">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Contribution Heatmap
            </CardTitle>
            <span className="text-xs text-muted-foreground tabular-nums">
              {totalUpdates} contribution{totalUpdates !== 1 ? "s" : ""} in the last year
            </span>
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          {/*
            ref div: ResizeObserver measures this element's width each time the
            card resizes, so visibleWeeks recalculates and the grid fills the
            available space without any horizontal scrollbar.
          */}
          <div ref={containerRef} className="w-full">
            <TooltipProvider>
              <div className="flex flex-col" style={{ gap: GAP }}>

                {/* ── Month labels ────────────────────────────────────────── */}
                {/*
                  Absolutely positioned inside a relative container so labels
                  can render at their natural width without being clipped by
                  any overflow:hidden ancestor.
                */}
                <div
                  className="relative h-4 select-none"
                  style={{ marginLeft: DAY_COL_W + DAY_COL_GAP, width: gridWidth }}
                >
                  {monthLabels.map(({ label, weekIndex }) => (
                    <span
                      key={`${label}-${weekIndex}`}
                      className="absolute text-[10px] text-muted-foreground whitespace-nowrap"
                      style={{ left: weekIndex * SLOT }}
                    >
                      {label}
                    </span>
                  ))}
                </div>

                {/* ── Day labels + week columns ────────────────────────────── */}
                <div className="flex" style={{ gap: DAY_COL_GAP }}>

                  {/* Day-of-week labels (M / W / F) */}
                  <div
                    className="flex flex-col flex-shrink-0 select-none"
                    style={{ width: DAY_COL_W, gap: GAP }}
                  >
                    {DAY_LABELS.map((d, i) => (
                      <div
                        key={i}
                        className="text-[10px] text-muted-foreground text-right leading-none flex items-center justify-end"
                        style={{ height: CELL }}
                      >
                        {d}
                      </div>
                    ))}
                  </div>

                  {/* Week columns */}
                  <div className="flex" style={{ gap: GAP }}>
                    {visibleWeeks.map((week, wi) => (
                      <div key={wi} className="flex flex-col" style={{ gap: GAP }}>
                        {week.map(({ date }) => {
                          const count    = activityMap[date] ?? 0;
                          const isToday  = date === todayStr;
                          return (
                            <Tooltip key={date}>
                              <TooltipTrigger
                                className={cn(
                                  "rounded-sm cursor-default transition-opacity hover:opacity-75 flex-shrink-0",
                                  getIntensityClass(count),
                                  isToday && "ring-1 ring-primary ring-offset-1 ring-offset-background"
                                )}
                                style={{ width: CELL, height: CELL }}
                              />
                              <TooltipContent side="top" className="text-xs font-mono">
                                {date}: {count} update{count !== 1 ? "s" : ""}
                              </TooltipContent>
                            </Tooltip>
                          );
                        })}
                      </div>
                    ))}
                  </div>

                </div>

                {/* ── Legend ──────────────────────────────────────────────── */}
                <div className="flex items-center gap-1.5 mt-0.5 justify-end select-none">
                  <span className="text-[10px] text-muted-foreground">Less</span>
                  {[0, 1, 2, 4].map(v => (
                    <div
                      key={v}
                      className={cn("rounded-sm flex-shrink-0", getIntensityClass(v))}
                      style={{ width: CELL, height: CELL }}
                    />
                  ))}
                  <span className="text-[10px] text-muted-foreground">More</span>
                </div>

              </div>
            </TooltipProvider>
          </div>
        </CardContent>
      </Card>

      {/* ── Monthly breakdown ─────────────────────────────────────────────── */}
      {monthlyData.length > 0 && (
        <Card className="fade-in-delay-3">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Monthly Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2.5">
              {monthlyData.map(([month, count]) => (
                <div key={month} className="flex items-center gap-3">
                  <span className="text-xs font-mono text-muted-foreground w-16 flex-shrink-0">{month}</span>
                  <div className="flex-1 bg-muted rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full transition-all duration-500"
                      style={{ width: `${(count / maxMonthly) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium tabular-nums w-6 text-right">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
