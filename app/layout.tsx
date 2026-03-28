import type { Metadata } from "next";
import { Poppins, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "LCTracker — Personal LeetCode Progress Tracker",
    template: "%s | LCTracker",
  },
  description:
    "Track your LeetCode journey across 63 curated problems. Log solutions, monitor streaks, visualize progress with a GitHub-style heatmap — no account needed.",
  keywords: [
    "LeetCode tracker", "coding interview prep", "algorithm practice",
    "data structures", "LeetCode progress", "FAANG interview",
  ],
  authors: [{ name: "Shababul Alam" }],
  creator: "Shababul Alam",
  openGraph: {
    type: "website",
    siteName: "LCTracker",
    title: "LCTracker — Personal LeetCode Progress Tracker",
    description:
      "Track your LeetCode journey across 63 curated problems. No account needed.",
  },
  twitter: {
    card: "summary_large_image",
    title: "LCTracker — Personal LeetCode Progress Tracker",
    description:
      "Track your LeetCode journey across 63 curated problems. No account needed.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${poppins.variable} ${jetbrainsMono.variable}`}>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <Navbar />
          <main className="container mx-auto px-4 py-8 max-w-6xl">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
