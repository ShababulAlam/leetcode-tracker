import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Problems — LCTracker",
  description: "Browse and track 63 curated LeetCode problems across Arrays, Trees, Graphs, Dynamic Programming, and more.",
};

export default function ProblemsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
