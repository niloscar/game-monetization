// Profildata hämtas nu från backend istället för mockdatans users/scores.
//
// TVÅ OLÖSTA SAKER HÄR — flaggar dem istället för att gissa:
//
// 1) Speltid/track finns inte i riktiga `scores`-tabellen.
//    Riktiga scores-raden är bara { id, userId, productId, score,
//    createdAt } (se backend/types/game.ts) — ingen track eller
//    playtimeSeconds. Det betyder att "Speltid, totalt" och alla
//    speltids-baserade prestationer i achievements.ts (typ hour-in/
//    marathon/explorer, om ni har såna) INTE kan räknas ut mot riktig
//    data just nu. Jag har tagit bort formatPlaytime/totalPlaytimeSeconds
//    härifrån helt istället för att låtsas de finns. Prata med Oscar om
//    ni vill lägga till kolumnerna på scores, eller besluta att de
//    prestationerna tas bort — säg till när ni bestämt er så uppdaterar
//    jag achievements.ts/ProfilePage.tsx efter det.
//
// 2) Det finns ingen "hämta user by username"-endpoint än.
//    Andras profiler (inte din egen) kan bara visa det som redan finns
//    i GET /api/game/scoreboard-svaret: userId, username, score, rank.
//    Tier och "medlem sedan" för ANDRA användare kan vi inte hämta just
//    nu. Fråga Oscar om en GET /api/user/:id eller liknande publik
//    endpoint — tills den finns förblir andras profilsidor
//    ofullständiga (ScorePage-nivå av info, inte full profil).

import api from "../api/apiClient";
import type { ScoreboardEntry } from "./scoreboard";

export interface UserScore {
  id: number;
  userId: number;
  productId: number;
  score: number;
  createdAt: string;
}

export interface ProfileStats {
  bestScore: number | null;
  averageScore: number | null;
  gamesPlayed: number;
}

// Identitet för den profil som visas. email/role/tier/createdAt är bara
// ifyllda för din EGEN profil (kommer från AuthContext/GET /api/user/me).
// För andras profiler har vi bara userId/username, se punkt 2) ovan.
export interface ProfileIdentity {
  userId: number;
  username: string;
  email?: string;
  role?: "user" | "admin";
  tier?: { id: number; name: string; description: string; level: number } | null;
  createdAt?: string;
}

// Egna scores — funkar redan (GET /api/game/score/me är verifierad).
export async function fetchMyScores(): Promise<UserScore[]> {
  const res = await api.get<UserScore[]>("/game/score/me");
  return res.data;
}

// Andra användares scores. Route:n finns (GET /api/game/score/user/:userId)
// men vi har inte bekräftat om den kräver admin eller funkar för alla
// inloggade — därför alltid try/catch runt anropet där den används,
// och stats blir bara null om den nekar.
export async function fetchScoresForUser(userId: number): Promise<UserScore[]> {
  const res = await api.get<UserScore[]>(`/game/score/user/${userId}`);
  return res.data;
}

export function getProfileStats(scores: UserScore[]): ProfileStats {
  if (scores.length === 0) {
    return { bestScore: null, averageScore: null, gamesPlayed: 0 };
  }
  const values = scores.map((s) => s.score);
  const bestScore = Math.max(...values);
  const averageScore = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  return { bestScore, averageScore, gamesPlayed: scores.length };
}

// Hittar en users placering i en redan hämtad scoreboard-lista (t.ex.
// från GET /api/game/scoreboard?period=all). null = ingen score alls än.
export function findRankInScoreboard(
  scoreboard: ScoreboardEntry[],
  userId: number
): number | null {
  return scoreboard.find((entry) => entry.userId === userId)?.rank ?? null;
}

// Hittar en annan users identitet + bästa score via scoreboard-listan —
// det enda vi har tillgängligt för andras profiler just nu (se punkt 2
// högst upp i filen).
export function findIdentityInScoreboard(
  scoreboard: ScoreboardEntry[],
  username: string
): (ProfileIdentity & { bestScoreFromBoard: number }) | null {
  const entry = scoreboard.find((e) => e.username === username);
  if (!entry) return null;
  return { userId: entry.userId, username: entry.username, bestScoreFromBoard: entry.score };
}

export type ProfileIconKey = "quarter" | "combo" | "highscore" | "admin";

const TIER_LEVEL_TO_ICON: Record<number, ProfileIconKey> = {
  1: "quarter",
  2: "combo",
  3: "highscore",
};

export function getProfileIconKey(identity: {
  role?: "user" | "admin";
  tier?: { level: number } | null;
}): ProfileIconKey {
  if (identity.role === "admin") return "admin";
  const level = identity.tier?.level;
  return (level && TIER_LEVEL_TO_ICON[level]) || "quarter";
}