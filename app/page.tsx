import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight, BookOpen, Activity, Star, Code2, Flame,
  CheckCircle2, BarChart3, Zap, Lock, RefreshCw,
} from "lucide-react";

export const metadata: Metadata = {
  title: "LCTracker — Personal LeetCode Progress Tracker",
  description:
    "Track your LeetCode journey across 63 curated problems. Log solutions, monitor streaks, visualize progress with a GitHub-style heatmap — all stored locally, no account needed.",
  keywords: [
    "LeetCode tracker", "coding interview prep", "algorithm practice",
    "problem solving tracker", "LeetCode progress", "data structures",
  ],
  openGraph: {
    title: "LCTracker — Personal LeetCode Progress Tracker",
    description:
      "Track your LeetCode journey across 63 curated problems. Log solutions, monitor streaks, visualize progress — no account needed.",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "LCTracker" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "LCTracker — Personal LeetCode Progress Tracker",
    description:
      "Track your LeetCode journey across 63 curated problems. Log solutions, monitor streaks, visualize progress — no account needed.",
    images: ["/opengraph-image"],
  },
};

const FEATURES = [
  {
    icon: BookOpen,
    title: "63 Curated Problems",
    description:
      "Hand-picked problems across 10 core topics — Arrays, Trees, Graphs, DP, and more. Every problem you need for top-tier interviews.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    icon: BarChart3,
    title: "Progress Dashboard",
    description:
      "See your overall completion rate, progress by topic and difficulty, and recently updated problems — all at a glance.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: Code2,
    title: "Solution Code Editor",
    description:
      "Paste your solution and preview it with Shiki syntax highlighting in 11 languages. Keep your approach notes alongside.",
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
  {
    icon: Flame,
    title: "Streak & Heatmap",
    description:
      "GitHub-style activity heatmap and streak counter. Stay consistent and watch your solving habit grow day by day.",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    icon: Star,
    title: "Personal Difficulty Rating",
    description:
      "Rate each problem by how hard you found it — not just LeetCode's label. Great for scheduling reviews.",
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
  {
    icon: Lock,
    title: "100% Local, No Sign-up",
    description:
      "All data lives in your browser's localStorage. No account, no server, no tracking. Your progress stays private.",
    color: "text-slate-400",
    bg: "bg-slate-500/10",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Pick a Problem",
    description:
      "Browse the curated list of 63 problems filtered by topic, difficulty, pattern, or frequency.",
  },
  {
    number: "02",
    title: "Track Your Attempt",
    description:
      "Log your status, time taken, attempts, date solved, difficulty rating, and paste your solution code.",
  },
  {
    number: "03",
    title: "Review & Improve",
    description:
      "Use the activity heatmap and topic breakdown to identify gaps and stay consistent with your practice.",
  },
];

const STATS = [
  { value: "63", label: "Curated Problems" },
  { value: "10", label: "Core Topics" },
  { value: "11", label: "Languages Supported" },
  { value: "0", label: "Sign-ups Required" },
];

const TOPICS = [
  "Arrays & Hashing", "Two Pointers", "Sliding Window",
  "Binary Search", "Linked List", "Trees",
  "Graphs", "Dynamic Programming", "Backtracking", "Heap / Priority Queue",
];

export default function LandingPage() {
  return (
    <div className="relative">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative py-20 md:py-32 text-center overflow-hidden">
        {/* Dot-grid + radial fade overlay */}
        <div className="dot-grid absolute inset-0 -z-10" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-background/60 to-background" />

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-6 fade-in">
          <Zap className="h-3 w-3" />
          Free &amp; Open Source · No account needed
        </div>

        <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight fade-in fade-in-delay-1">
          Master LeetCode.<br />
          <span className="text-primary">Track Every Step.</span>
        </h1>

        <p className="mt-5 max-w-xl mx-auto text-base md:text-lg text-muted-foreground leading-relaxed fade-in fade-in-delay-2">
          A focused tracker for your coding interview prep — 63 curated problems,
          solution notes, a Shiki-powered code editor, streak tracking, and a
          GitHub-style activity heatmap. All saved locally in your browser.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 fade-in fade-in-delay-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow hover:opacity-90 transition-opacity"
          >
            Go to Dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/problems"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-semibold hover:bg-muted transition-colors"
          >
            <BookOpen className="h-4 w-4" />
            Browse Problems
          </Link>
        </div>
      </section>

      {/* ── Stats strip ───────────────────────────────────────────────────── */}
      <section className="border-y border-border/60 bg-card/50">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {STATS.map(({ value, label }, i) => (
            <div
              key={label}
              className={`flex flex-col items-center justify-center py-8 px-4 text-center
                ${i < STATS.length - 1 ? "md:border-r border-border/60" : ""}
                ${i === 1 ? "border-r border-border/60 md:border-r" : ""}
              `}
            >
              <span className="text-3xl font-bold text-primary tabular-nums">{value}</span>
              <span className="mt-1 text-xs text-muted-foreground font-medium uppercase tracking-wide">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features grid ─────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Features</p>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Everything you need to stay focused
          </h2>
          <p className="mt-3 text-muted-foreground max-w-md mx-auto text-sm">
            No bloat. Just the tools that actually help you practice better and remember more.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, description, color, bg }) => (
            <div
              key={title}
              className="group rounded-xl border border-border bg-card p-5 hover:border-primary/40 hover:shadow-md transition-all duration-200"
            >
              <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${bg} mb-4`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <h3 className="font-semibold text-sm mb-1.5">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────────────── */}
      <section className="py-20 md:py-24 border-t border-border/60">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">How it works</p>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Simple by design</h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {STEPS.map(({ number, title, description }) => (
            <div key={number} className="relative flex flex-col items-start gap-3 pl-6 border-l-2 border-border">
              <span className="text-4xl font-bold text-primary/20 tabular-nums leading-none">{number}</span>
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Topics covered ─────────────────────────────────────────────────── */}
      <section className="py-16 border-t border-border/60">
        <div className="text-center mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Coverage</p>
          <h2 className="text-2xl font-bold tracking-tight">10 core interview topics</h2>
          <p className="mt-2 text-sm text-muted-foreground">Covering the patterns that appear most often in FAANG-level interviews.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-2.5 max-w-2xl mx-auto">
          {TOPICS.map(topic => (
            <span
              key={topic}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:border-primary/40 hover:bg-primary/5 transition-colors"
            >
              <CheckCircle2 className="h-3 w-3 text-primary flex-shrink-0" />
              {topic}
            </span>
          ))}
        </div>
      </section>

      {/* ── Coming soon ───────────────────────────────────────────────────── */}
      <section className="py-16 border-t border-border/60">
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-5">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
            <RefreshCw className="h-6 w-6 text-amber-500" />
          </div>
          <div className="flex-1">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 px-2.5 py-0.5 text-xs font-semibold text-amber-500 mb-2">
              Coming Soon
            </div>
            <h3 className="font-semibold text-base">LeetCode Sync</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Connect your public LeetCode profile and automatically sync accepted submissions.
              We&apos;ll match your solutions to the curated list and update your progress — no manual entry needed.
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="relative py-20 md:py-28 text-center overflow-hidden border-t border-border/60">
        <div className="dot-grid absolute inset-0 -z-10 opacity-50" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-transparent via-background/80 to-background" />

        <h2 className="text-2xl md:text-4xl font-bold tracking-tight">
          Ready to level up your interview prep?
        </h2>
        <p className="mt-4 text-muted-foreground text-sm max-w-sm mx-auto">
          No sign-up. No subscription. Just open it and start tracking.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md hover:opacity-90 transition-opacity"
          >
            Get Started — It&apos;s Free
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/activity"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-3 text-sm font-medium hover:bg-muted transition-colors"
          >
            <Activity className="h-4 w-4" />
            View Activity
          </Link>
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          Built by <span className="font-medium text-foreground">Shababul Alam</span> · Open Source
        </p>
      </section>
    </div>
  );
}
