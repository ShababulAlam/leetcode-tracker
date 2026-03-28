import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — LCTracker",
  description: "Your LeetCode progress at a glance — solved problems, topic breakdown, difficulty stats, and recently updated problems.",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
