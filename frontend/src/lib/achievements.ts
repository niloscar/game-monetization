import type { UserScore } from "./profile";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface AchievementProgress {
  achievement: Achievement;
  unlocked: boolean;
}

interface AchievementStats {
  gamesPlayed: number;
  rank: number | null;
}

interface AchievementDef extends Achievement {
  isUnlocked: (stats: AchievementStats) => boolean;
}

const ACHIEVEMENT_DEFS: AchievementDef[] = [
  {
    id: "first-quarter",
    name: "Första myntet",
    description: "Spela din första omgång.",
    icon: "🪙",
    isUnlocked: (s) => s.gamesPlayed >= 1,
  },
  {
    id: "regular",
    name: "Stammis",
    description: "Spela 10 omgångar.",
    icon: "🕹️",
    isUnlocked: (s) => s.gamesPlayed >= 10,
  },
  {
    id: "veteran",
    name: "Arkadveteran",
    description: "Spela 50 omgångar.",
    icon: "👾",
    isUnlocked: (s) => s.gamesPlayed >= 50,
  },
  {
    id: "top-ten",
    name: "Topp 10",
    description: "Nå en topp 10-placering på scoreboard.",
    icon: "🔥",
    isUnlocked: (s) => s.rank != null && s.rank <= 10,
  },
  {
    id: "podium",
    name: "Pallplats",
    description: "Nå en topp 3-placering på scoreboard.",
    icon: "🏆",
    isUnlocked: (s) => s.rank != null && s.rank <= 3,
  },
  {
    id: "champion",
    name: "Mästare",
    description: "Ta förstaplatsen på scoreboard.",
    icon: "👑",
    isUnlocked: (s) => s.rank === 1,
  },
];

function getAchievementStats(
  scores: UserScore[],
  userId: number,
  rank: number | null
): AchievementStats {
  const own = scores.filter((s) => s.userId === userId);
  return {
    gamesPlayed: own.length,
    rank,
  };
}

export function getAchievements(
  scores: UserScore[],
  userId: number,
  rank: number | null
): AchievementProgress[] {
  const stats = getAchievementStats(scores, userId, rank);
  return ACHIEVEMENT_DEFS.map((def) => ({
    achievement: def,
    unlocked: def.isUnlocked(stats),
  }));
}

export function countUnlocked(progress: AchievementProgress[]): number {
  return progress.filter((p) => p.unlocked).length;
}