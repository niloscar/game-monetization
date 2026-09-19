// Prestationer (achievements) för profilsidan i PizzaArcade.
//
// Bygger bara på data vi redan har i mock/scores — inga nya fält behövs.
// Trösklarna är satta relativt (antal omgångar, speltid, placering,
// antal olika banor) istället för absoluta poängnivåer, eftersom
// poängskalan skiljer sig mellan spel/banor.

import type { Score } from "../mock/types";

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
  totalPlaytimeSeconds: number;
  distinctTracks: number;
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
    id: "hour-in",
    name: "En timme in",
    description: "Logga en timmes speltid totalt.",
    icon: "⏱️",
    isUnlocked: (s) => s.totalPlaytimeSeconds >= 3600,
  },
  {
    id: "marathon",
    name: "Maratonspelare",
    description: "Logga 10 timmars speltid totalt.",
    icon: "🏁",
    isUnlocked: (s) => s.totalPlaytimeSeconds >= 10 * 3600,
  },
  {
    id: "explorer",
    name: "Utforskare",
    description: "Spela på 3 olika banor.",
    icon: "🗺️",
    isUnlocked: (s) => s.distinctTracks >= 3,
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

function getAchievementStats(scores: Score[], userId: string, rank: number | null): AchievementStats {
  const own = scores.filter((s) => s.userId === userId);
  return {
    gamesPlayed: own.length,
    totalPlaytimeSeconds: own.reduce((sum, s) => sum + s.playtimeSeconds, 0),
    distinctTracks: new Set(own.map((s) => s.track)).size,
    rank,
  };
}

/** Alla prestationer med upplåst-status för en given spelare, i definitionsordning. */
export function getAchievements(
  scores: Score[],
  userId: string,
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