# LCTracker

A personal LeetCode progress tracking app built with Next.js. Track your problem-solving journey across 63 curated problems, log solutions, notes, and visualize your activity over time.

## Features

- **Problem Tracker** — Browse and filter 63 curated LeetCode problems by topic, difficulty, pattern, and status
- **Detailed Tracking** — Per-problem tracking: status, attempts, time taken, date solved, personal difficulty rating, notes, and solution code
- **Activity Heatmap** — GitHub-style contribution heatmap showing daily solving activity
- **Streak Tracking** — Current and longest streak stats
- **Dark/Light Mode** — Theme toggle with system preference detection
- **LeetCode Sync** *(Coming Soon)* — Sync your accepted submissions directly from LeetCode

## Tech Stack

- [Next.js 15](https://nextjs.org/) (App Router, Turbopack)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/) (base-ui flavor)
- [date-fns](https://date-fns.org/)
- [Lucide Icons](https://lucide.dev/)
- `localStorage` — all data persisted locally, no backend required

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [pnpm](https://pnpm.io/)

### Install & Run

```bash
# Install dependencies
pnpm install

# Start dev server on port 4001
pnpm dev
```

Open [http://localhost:4001](http://localhost:4001) in your browser.

### Build for Production

```bash
pnpm build
pnpm start
```

## Project Structure

```
leetcode-tracker/
├── app/
│   ├── page.tsx              # Dashboard / home
│   ├── problems/
│   │   ├── page.tsx          # Problem list with filters
│   │   └── [id]/page.tsx     # Problem detail & tracking form
│   └── activity/page.tsx     # Activity heatmap & streaks
├── components/
│   ├── navbar.tsx            # Top navigation bar
│   ├── status-badge.tsx      # Status pill badge
│   └── sync-dialog.tsx       # LeetCode sync dialog (coming soon)
├── lib/
│   ├── problems.ts           # 63 curated problem definitions
│   ├── storage.ts            # localStorage read/write helpers
│   ├── sync.ts               # LeetCode sync logic (alfa-leetcode-api)
│   ├── types.ts              # Shared TypeScript types
│   └── user.ts               # Anonymous user ID generation
└── public/
```

## Data Storage

All data is stored in `localStorage` under these keys:

| Key | Contents |
|-----|----------|
| `lct_problems` | Map of problem entries (status, notes, solution code, etc.) |
| `lct_activity` | Array of daily activity counts for the heatmap |
| `lct_sync_meta` | LeetCode sync metadata (username, last sync time) |
| `lct_user_id` | Anonymous local user identifier |

No account or login required. All data stays on your device.

## LeetCode Sync (Coming Soon)

The sync feature will use the public [alfa-leetcode-api](https://github.com/alfaarghya/alfa-leetcode-api) to fetch your accepted submissions by LeetCode username (no API key required — profile must be public). It will:

- Match accepted submissions against the 63 tracked problems
- Mark matched problems as **Solved** with the earliest accepted submission date
- Merge LeetCode submission calendar into the activity heatmap
- Show a preview diff before applying any changes

## Author

**Shababul Alam**

## License

MIT
