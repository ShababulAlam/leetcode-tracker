import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LCTracker — Personal LeetCode Progress Tracker",
    short_name: "LCTracker",
    description:
      "Track your LeetCode journey across 63 curated problems. No account needed.",
    start_url: "/",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#10b981",
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
  };
}
