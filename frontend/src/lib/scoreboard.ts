// Matchar nuvarande mock/types.ts:
//   Score { id, userId, value, playtimeSeconds, track, createdAt }
//
// OBS: den riktiga scores-tabellen i databasen har fälten
// id, user_id, product_id, score, created_at, deleted_at — dvs andra namn
// (score istället för value, ingen playtimeSeconds/track, plus deletedAt).
// När mock/types.ts uppdateras för att matcha databasen behöver den här
// filen justeras igen (byt .value -> .score, lägg tillbaka ett
// !s.deletedAt-filter).

import type { Score, User } from "../mock/types";

export type Period = "today" | "week" | "all";

export interface LeaderboardEntry {
  rank: number;
  user: User;
  score: Score;
}

function isWithinPeriod(createdAt: string, period: Period): boolean {
  if (period === "all") return true;
  const now = Date.now();
  const created = new Date(createdAt).getTime();
  const diffMs = now - created;
  if (period === "today") return diffMs <= 24 * 60 * 60 * 1000;
  // "week" = rullande 7 dagar, inte kalendervecka
  if (period === "week") return diffMs <= 7 * 24 * 60 * 60 * 1000;
  return true;
}

/**
 * Bygger topplistan för en given period.
 * En spelare kan ha flera scores (flera spelomgångar) — bara den BÄSTA
 * per spelare räknas in på listan, annars skulle samma person kunna ta
 * flera platser samtidigt.
 * Sortering: högst poäng överst. Vid lika poäng: den som nådde poängen
 * först rankas högre (kan behöva ändras beroende på hur spelets
 * poängsystem slutligen fungerar).
 */
export function getLeaderboard(
  scores: Score[],
  users: User[],
  period: Period = "all"
): LeaderboardEntry[] {
  const userById = new Map(users.map((u) => [u.id, u]));

  const filtered = scores.filter((s) => isWithinPeriod(s.createdAt, period));

  // Behåll bara varje spelares bästa score i perioden.
  const bestByUser = new Map<string, Score>();
  for (const s of filtered) {
    const current = bestByUser.get(s.userId);
    if (!current || s.value > current.value) {
      bestByUser.set(s.userId, s);
    }
  }

  const sorted = [...bestByUser.values()].sort((a, b) => {
    if (b.value !== a.value) return b.value - a.value;
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  return sorted
    .map((score, i) => {
      const user = userById.get(score.userId);
      if (!user) return null;
      return { rank: i + 1, user, score };
    })
    .filter((entry): entry is LeaderboardEntry => entry !== null);
}

export function getOwnEntry(
  leaderboard: LeaderboardEntry[],
  userId: string
): LeaderboardEntry | undefined {
  return leaderboard.find((entry) => entry.user.id === userId);
}

export function getTopN(leaderboard: LeaderboardEntry[], n: number): LeaderboardEntry[] {
  return leaderboard.slice(0, n);
}

export function formatPoints(points: number): string {
  return `${points.toLocaleString("sv-SE")} p`;
}