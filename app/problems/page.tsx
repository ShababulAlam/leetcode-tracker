"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ExternalLink, ArrowUpDown, ArrowUp, ArrowDown, Search, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/status-badge";
import { PROBLEMS } from "@/lib/problems";
import { getAllEntries, saveEntry, getDefaultEntry } from "@/lib/storage";
import { ProblemEntry, Status, Difficulty } from "@/lib/types";
import { cn } from "@/lib/utils";

type SortField = "name" | "difficulty" | "frequency" | "status" | "lastUpdated";
type SortDir = "asc" | "desc";

const DIFFICULTY_ORDER = { easy: 0, medium: 1, hard: 2 };
const FREQUENCY_ORDER = { "Extremely High": 0, "High": 1, "Medium": 2 };
const STATUS_ORDER = { solved: 0, inprogress: 1, needs_review: 2, todo: 3 };

const DIFF_STYLES: Record<Difficulty, string> = {
  easy: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
  medium: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
  hard: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800",
};

const FREQ_STYLES: Record<string, string> = {
  "Extremely High": "text-primary font-semibold",
  "High": "text-muted-foreground",
  "Medium": "text-muted-foreground/60",
};

const TOPICS = [...new Set(PROBLEMS.map(p => p.topic))];

// Vercel best practice: lazy initializer avoids reading localStorage on every render
function loadEntries(): ProblemEntry[] {
  return getAllEntries();
}

export default function ProblemsPage() {
  const [entries, setEntries] = useState<ProblemEntry[]>(loadEntries);
  const [search, setSearch] = useState("");
  const [topicFilter, setTopicFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | "all">("all");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
  const [frequencyFilter, setFrequencyFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  // Vercel best practice: Map for O(1) lookups instead of repeated .find()
  const entryMap = useMemo(() => new Map(entries.map(e => [e.id, e])), [entries]);

  const filtered = useMemo(() => {
    const lSearch = search.toLowerCase();
    let result = PROBLEMS.filter(p => {
      if (lSearch && !p.name.toLowerCase().includes(lSearch)) return false;
      if (topicFilter !== "all" && p.topic !== topicFilter) return false;
      if (difficultyFilter !== "all" && p.difficulty !== difficultyFilter) return false;
      if (frequencyFilter !== "all" && p.frequency !== frequencyFilter) return false;
      if (statusFilter !== "all") {
        const status = entryMap.get(p.id)?.status ?? "todo";
        if (status !== statusFilter) return false;
      }
      return true;
    });

    result.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case "name": cmp = a.name.localeCompare(b.name); break;
        case "difficulty": cmp = DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty]; break;
        case "frequency": cmp = FREQUENCY_ORDER[a.frequency] - FREQUENCY_ORDER[b.frequency]; break;
        case "status": {
          const sa = entryMap.get(a.id)?.status ?? "todo";
          const sb = entryMap.get(b.id)?.status ?? "todo";
          cmp = STATUS_ORDER[sa] - STATUS_ORDER[sb];
          break;
        }
        case "lastUpdated": {
          const la = entryMap.get(a.id)?.lastUpdated ?? "";
          const lb = entryMap.get(b.id)?.lastUpdated ?? "";
          cmp = la.localeCompare(lb);
          break;
        }
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return result;
  }, [entries, entryMap, search, topicFilter, difficultyFilter, statusFilter, frequencyFilter, sortField, sortDir]);

  const handleStatusChange = (id: string, status: Status) => {
    const existing = entryMap.get(id) ?? getDefaultEntry(id);
    saveEntry({ ...existing, status });
    // Vercel best practice: functional setState for stable updates
    setEntries(getAllEntries());
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  const resetFilters = () => {
    setSearch("");
    setTopicFilter("all");
    setDifficultyFilter("all");
    setStatusFilter("all");
    setFrequencyFilter("all");
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3 opacity-40" />;
    return sortDir === "asc"
      ? <ArrowUp className="h-3 w-3 text-primary" />
      : <ArrowDown className="h-3 w-3 text-primary" />;
  };

  const hasFilters = search || topicFilter !== "all" || difficultyFilter !== "all" || statusFilter !== "all" || frequencyFilter !== "all";

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Problems</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Showing <span className="font-medium text-foreground">{filtered.length}</span> of {PROBLEMS.length} problems
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filters
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search problems..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-8 w-52 h-8 text-sm"
            />
          </div>
          <Select value={topicFilter} onValueChange={v => setTopicFilter(v ?? "all")}>
            <SelectTrigger className="w-44 h-8 text-sm"><SelectValue placeholder="Topic" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Topics</SelectItem>
              {TOPICS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={difficultyFilter} onValueChange={v => setDifficultyFilter((v ?? "all") as Difficulty | "all")}>
            <SelectTrigger className="w-36 h-8 text-sm"><SelectValue placeholder="Difficulty" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulties</SelectItem>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={v => setStatusFilter((v ?? "all") as Status | "all")}>
            <SelectTrigger className="w-36 h-8 text-sm"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="inprogress">In Progress</SelectItem>
              <SelectItem value="solved">Solved</SelectItem>
              <SelectItem value="needs_review">Needs Review</SelectItem>
            </SelectContent>
          </Select>
          <Select value={frequencyFilter} onValueChange={v => setFrequencyFilter(v ?? "all")}>
            <SelectTrigger className="w-40 h-8 text-sm"><SelectValue placeholder="Frequency" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Frequencies</SelectItem>
              <SelectItem value="Extremely High">Extremely High</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
            </SelectContent>
          </Select>
          {hasFilters && (
            <Button variant="ghost" size="sm" className="h-8 text-sm text-muted-foreground" onClick={resetFilters}>
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Sort Header */}
      <div className="hidden md:grid grid-cols-[1fr_auto_auto_auto_auto_auto_auto] gap-3 items-center px-3 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide border-b border-border">
        <button className="flex items-center gap-1 hover:text-foreground transition-colors" onClick={() => toggleSort("name")}>
          Problem <SortIcon field="name" />
        </button>
        <button className="flex items-center gap-1 hover:text-foreground transition-colors w-16" onClick={() => toggleSort("difficulty")}>
          Diff <SortIcon field="difficulty" />
        </button>
        <button className="flex items-center gap-1 hover:text-foreground transition-colors w-24" onClick={() => toggleSort("status")}>
          Status <SortIcon field="status" />
        </button>
        <span className="w-32">Topic</span>
        <span className="w-28">Pattern</span>
        <button className="flex items-center gap-1 hover:text-foreground transition-colors w-24" onClick={() => toggleSort("frequency")}>
          Freq <SortIcon field="frequency" />
        </button>
        <span className="w-32">Quick Set</span>
      </div>

      {/* Problem Rows */}
      <div className="space-y-0.5">
        {filtered.map((problem, i) => {
          const entry = entryMap.get(problem.id);
          const status = entry?.status ?? "todo";
          return (
            <div
              key={problem.id}
              className="group grid grid-cols-1 md:grid-cols-[1fr_auto_auto_auto_auto_auto_auto] gap-3 items-center px-3 py-2.5 rounded-lg border border-transparent hover:border-border hover:bg-card transition-all"
              style={{ animationDelay: `${i * 0.01}s` }}
            >
              {/* Name + external link */}
              <div className="flex items-center gap-2 min-w-0">
                <Link
                  href={`/problems/${problem.id}`}
                  className="font-medium text-sm truncate hover:text-primary transition-colors"
                >
                  {problem.name}
                </Link>
                <a
                  href={problem.leetcodeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground hover:text-primary transition-colors" />
                </a>
              </div>

              {/* Difficulty */}
              <span className={cn("inline-flex px-2 py-0.5 rounded-full text-xs font-medium border w-16 justify-center", DIFF_STYLES[problem.difficulty])}>
                {problem.difficulty}
              </span>

              {/* Status */}
              <div className="w-24">
                <StatusBadge status={status} />
              </div>

              {/* Topic */}
              <Badge variant="secondary" className="text-xs w-32 justify-center truncate">{problem.topic}</Badge>

              {/* Pattern */}
              <span className="text-xs text-muted-foreground w-28 truncate">{problem.pattern}</span>

              {/* Frequency */}
              <span className={cn("text-xs w-24", FREQ_STYLES[problem.frequency])}>{problem.frequency}</span>

              {/* Quick status */}
              <Select value={status} onValueChange={v => v && handleStatusChange(problem.id, v as Status)}>
                <SelectTrigger className="h-7 w-32 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="inprogress">In Progress</SelectItem>
                  <SelectItem value="solved">Solved</SelectItem>
                  <SelectItem value="needs_review">Needs Review</SelectItem>
                </SelectContent>
              </Select>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Search className="h-8 w-8 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No problems match your filters.</p>
            <button onClick={resetFilters} className="text-xs text-primary hover:underline mt-1">Clear filters</button>
          </div>
        )}
      </div>
    </div>
  );
}
