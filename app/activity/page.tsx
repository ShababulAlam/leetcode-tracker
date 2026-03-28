"use client";

import { useState, useMemo } from "react";
import { Flame, TrendingUp, CalendarDays, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getActivity } from "@/lib/storage";
import { getCurrentStreak, getLongestStreak } from "@/lib/streak";
import { ActivityEntry } from "@/lib/types";
import { cn } from "@/lib/utils";

// Vercel best practice: lazy state initializer
function loadActivity(): ActivityEntry[] {
  return getActivity();
}

// Hoist static data outside component
const WEEKS = generateCalendarWeeks();
const MONTH_LABELS = getMonthLabels(WEEKS);

function getIntensityClass(count: number): string {
  if (count === 0) return "bg-border/60 dark:bg-muted/40";
  if (count === 1) return "bg-emerald-200 dark:bg-emerald-900";
  if (count <= 3) return "bg-emerald-400 dark:bg-emerald-700";
  return "bg-emerald-600 dark:bg-emerald-500";
}

function generateCalendarWeeks(): { date: string }[][] {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 364);
  startDate.setDate(startDate.getDate() - startDate.getDay());

  const weeks: { date: string }[][] = [];
  const cursor = new Date(startDate);
  const endDate = new Date(today);

  while (cursor <= endDate) {
    const week: { date: string }[] = [];
    for (let d = 0; d < 7; d++) {
      week.push({ date: cursor.toISOString().split("T")[0] });
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}

function getMonthLabels(weeks: { date: string }[][]): { label: string; weekIndex: number }[] {
  const labels: { label: string; weekIndex: number }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, i) => {
    const month = new Date(week[0].date).getMonth();
    if (month !== lastMonth) {
      labels.push({
        label: new Date(week[0].date).toLocaleString("default", { month: "short" }),
        weekIndex: i,
      });
      lastMonth = month;
    }
  });
  return labels;
}

const DAY_LABELS = ["", "M", "", "W", "", "F", ""];

export default function ActivityPage() {
  const [activityData] = useState<ActivityEntry[]>(loadActivity);

  // Vercel: derive all state during render
  const activityMap = useMemo(() => {
    const map: Record<string, number> = {};
    activityData.forEach(e => { map[e.date] = e.count; });
    return map;
  }, [activityData]);

  const currentStreak = getCurrentStreak(activityData);
  const longestStreak = getLongestStreak(activityData);
  const totalActiveDays = activityData.length;
  const totalUpdates = activityData.reduce((sum, e) => sum + e.count, 0);
  const todayStr = new Date().toISOString().split("T")[0];

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
    { label: "Current Streak", value: currentStreak, unit: "days", icon: Flame, accent: "text-orange-500", accent2: "card-accent-amber" },
    { label: "Longest Streak", value: longestStreak, unit: "days", icon: TrendingUp, accent: "text-primary", accent2: "card-accent-emerald" },
    { label: "Active Days", value: totalActiveDays, unit: null, icon: CalendarDays, accent: "text-blue-500", accent2: "card-accent-blue" },
    { label: "Total Updates", value: totalUpdates, unit: null, icon: Zap, accent: "text-muted-foreground", accent2: "card-accent-slate" },
  ];

  return (
    <div className="space-y-8 fade-in">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Activity</h1>
        <p className="text-sm text-muted-foreground mt-1">Your coding consistency over the past year</p>
      </div>

      {/* Streak Stats */}
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

      {/* Heatmap */}
      <Card className="fade-in-delay-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Contribution Heatmap
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto pb-2">
            <TooltipProvider>
              <div className="inline-flex flex-col gap-1 min-w-max">
                {/* Month labels */}
                <div className="flex gap-0.5 ml-7">
                  {WEEKS.map((_, i) => (
                    <div key={i} className="w-3 text-center overflow-hidden">
                      <span className="text-[10px] text-muted-foreground">
                        {MONTH_LABELS.find(m => m.weekIndex === i)?.label ?? ""}
                      </span>
                    </div>
                  ))}
                </div>
                {/* Grid */}
                <div className="flex gap-0.5">
                  {/* Day labels */}
                  <div className="flex flex-col gap-0.5 mr-1 w-6">
                    {DAY_LABELS.map((d, i) => (
                      <div key={i} className="h-3 text-[10px] text-muted-foreground leading-3 text-right pr-0.5">
                        {d}
                      </div>
                    ))}
                  </div>
                  {/* Weeks */}
                  {WEEKS.map((week, wi) => (
                    <div key={wi} className="flex flex-col gap-0.5">
                      {week.map(({ date }) => {
                        const count = activityMap[date] ?? 0;
                        const isToday = date === todayStr;
                        return (
                          <Tooltip key={date}>
                            <TooltipTrigger
                              className={cn(
                                "h-3 w-3 rounded-sm cursor-default transition-opacity hover:opacity-80",
                                getIntensityClass(count),
                                isToday && "ring-1 ring-primary ring-offset-1 ring-offset-background"
                              )}
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
                {/* Legend */}
                <div className="flex items-center gap-1.5 mt-2 justify-end">
                  <span className="text-[10px] text-muted-foreground">Less</span>
                  {[0, 1, 2, 4].map(v => (
                    <div key={v} className={cn("h-3 w-3 rounded-sm", getIntensityClass(v))} />
                  ))}
                  <span className="text-[10px] text-muted-foreground">More</span>
                </div>
              </div>
            </TooltipProvider>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Breakdown */}
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
                  <div className="flex-1 bg-muted rounded-full h-3 overflow-hidden">
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
