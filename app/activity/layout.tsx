import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Activity — LCTracker",
  description: "View your daily coding activity heatmap, current streak, and longest streak across your LeetCode practice sessions.",
};

export default function ActivityLayout({ children }: { children: React.ReactNode }) {
  return children;
}
