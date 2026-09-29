export type Period = "today" | "week" | "all";

export interface ScoreboardEntry {
  rank: number;
  userId: number;
  username: string;
  score: number;
}

export interface ScoreboardResponse {
  period: Period;
  scoreboard: ScoreboardEntry[];
  own: ScoreboardEntry | null;
}

export function formatPoints(points: number): string {
  return `${points.toLocaleString("sv-SE")} p`;
}