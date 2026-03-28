export type Status = "todo" | "inprogress" | "solved" | "needs_review";
export type Difficulty = "easy" | "medium" | "hard";

export interface ProblemEntry {
  id: string;
  status: Status;
  userDifficultyRating: 1 | 2 | 3 | 4 | 5 | null;
  notes: string;
  solutionCode: string;
  solutionLang: string;
  timeTakenMinutes: number | null;
  dateSolved: string | null;
  attempts: number;
  lastUpdated: string;
}

export interface ActivityEntry {
  date: string;
  count: number;
}

export interface Problem {
  id: string;
  name: string;
  difficulty: Difficulty;
  topic: string;
  pattern: string;
  frequency: "Extremely High" | "High" | "Medium";
  leetcodeUrl: string;
}
