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

// role kommer från backend som ett objekt (json_build_object i
// services/user.ts: { id, name, description }), inte en ren sträng
// "user"/"admin" — döljer man det bakom en unionstyp av strängar matchar
// TypeScript aldrig verklig data.
export interface ProfileRole {
    id: number
    name: string
    description: string | null
}

export interface ProfileIdentity {
    userId: number
    username: string
    email?: string
    role?: ProfileRole | null
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

// Hämtar tier/role/createdAt för en ANNAN användares profil (via
// /api/user/username/:username, som medvetet inte skickar med e-post).
// Behövs eftersom scoreboard-svaret bara innehåller rank/userId/username/
// score — inget tier-fält — så "Okänd nivå" på andras profiler kommer
// härifrån om anropet misslyckas eller användaren saknar produkt/tier.
export async function fetchPublicProfile(
    username: string
): Promise<Pick<ProfileIdentity, 'role' | 'tier' | 'createdAt'> | null> {
    try {
        const res = await api.get(`/user/username/${username}`)
        return {
            role: res.data.role,
            tier: res.data.tier,
            createdAt: res.data.created_at ?? res.data.createdAt
        }
    } catch {
        return null
    }
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
    role?: ProfileRole | null
    tier?: { level: number } | null
}): ProfileIconKey {
    if (identity.role?.name === 'admin') return 'admin'
    const level = identity.tier?.level
    return (level && TIER_LEVEL_TO_ICON[level]) || 'quarter'
}
