import api from '../api/apiClient'
import type { ScoreboardEntry } from './scoreboard'

export interface UserScore {
    id: number
    userId: number
    productId: number
    score: number
    createdAt: string
}

export interface ProfileStats {
    bestScore: number | null
    averageScore: number | null
    gamesPlayed: number
}

export interface ProfileIdentity {
    userId: number
    username: string
    email?: string
    role?: 'user' | 'admin'
    tier?: {
        id: number
        name: string
        description: string
        level: number
    } | null
    createdAt?: string
}

export async function fetchMyScores(): Promise<UserScore[]> {
    const res = await api.get<UserScore[]>('/game/score/me')
    return res.data
}

export async function fetchScoresForUser(userId: number): Promise<UserScore[]> {
    const res = await api.get<UserScore[]>(`/game/score/user/${userId}`)
    return res.data
}

export function getProfileStats(scores: UserScore[]): ProfileStats {
    if (scores.length === 0) {
        return { bestScore: null, averageScore: null, gamesPlayed: 0 }
    }
    const values = scores.map((s) => s.score)
    const bestScore = Math.max(...values)
    const averageScore = Math.round(
        values.reduce((a, b) => a + b, 0) / values.length
    )
    return { bestScore, averageScore, gamesPlayed: scores.length }
}

export function findRankInScoreboard(
    scoreboard: ScoreboardEntry[],
    userId: number
): number | null {
    return scoreboard.find((entry) => entry.userId === userId)?.rank ?? null
}

export function findIdentityInScoreboard(
    scoreboard: ScoreboardEntry[],
    username: string
): (ProfileIdentity & { bestScoreFromBoard: number }) | null {
    const entry = scoreboard.find((e) => e.username === username)
    if (!entry) return null
    return {
        userId: entry.userId,
        username: entry.username,
        bestScoreFromBoard: entry.score
    }
}

export type ProfileIconKey = 'quarter' | 'combo' | 'highscore' | 'admin'

const TIER_LEVEL_TO_ICON: Record<number, ProfileIconKey> = {
    1: 'quarter',
    2: 'combo',
    3: 'highscore'
}

export function getProfileIconKey(identity: {
    role?: 'user' | 'admin'
    tier?: { level: number } | null
}): ProfileIconKey {
    if (identity.role === 'admin') return 'admin'
    const level = identity.tier?.level
    return (level && TIER_LEVEL_TO_ICON[level]) || 'quarter'
}
