import type { Score, User } from "../mock/types";
import { getLeaderboard } from "./scoreboard";

export function findUserByUsername(users: User[], username: string): User | undefined {
  return users.find((u) => u.username === username);
}

export interface ProfileStats {
  gamesPlayed: number;
  bestScore: number | null;
  averageScore: number | null;
  totalPlaytimeSeconds: number;
  rank: number | null;
}

export function getProfileStats(scores: Score[], userId: string): ProfileStats {
  const own = scores.filter((s) => s.userId === userId);

  if (own.length === 0) {
    return {
      gamesPlayed: 0,
      bestScore: null,
      averageScore: null,
      totalPlaytimeSeconds: 0,
      rank: null,
    };
  }

  const best = Math.max(...own.map((s) => s.value));
  const average = Math.round(own.reduce((sum, s) => sum + s.value, 0) / own.length);
  const totalPlaytimeSeconds = own.reduce((sum, s) => sum + s.playtimeSeconds, 0);

  return {
    gamesPlayed: own.length,
    bestScore: best,
    averageScore: average,
    totalPlaytimeSeconds,
    rank: null, // sätts separat via getProfileRank, kräver hela leaderboarden
  };
}

export function formatPlaytime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (hours === 0) return `${minutes}m`;
  return `${hours}h ${minutes}m`;
}

export function getProfileRank(scores: Score[], users: User[], userId: string): number | null {
  const leaderboard = getLeaderboard(scores, users, "all");
  const entry = leaderboard.find((e) => e.user.id === userId);
  return entry ? entry.rank : null;
}

export type ProfileIconKey = "quarter" | "combo" | "highscore" | "admin";

const TIER_SLUG_TO_ICON: Record<string, ProfileIconKey> = {
  "quarter-pass": "quarter",
  "combo-pass": "combo",
  "high-score-access": "highscore",
};

export function getProfileIconKey(
  user: Pick<User, "role" | "tierId">,
  tierSlugById: Map<string, string>
): ProfileIconKey {
  if (user.role === "admin") return "admin";
  const slug = tierSlugById.get(user.tierId);
  return (slug && TIER_SLUG_TO_ICON[slug]) || "quarter";
}