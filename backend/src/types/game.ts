export type { AdPolicy } from '@assignment/shared/types/ad'
export interface Score {
    id: number
    userId: number
    username: string
    productId: number
    tierLevelSnapshot: number
    score: number
    createdAt: Date
}

export interface CreateScoreBody {
    score: number
}

export interface CreateScoreData {
    userId: number
    score: number
}

export type ScoreboardPeriod = 'today' | 'week' | 'all'

export interface ScoreboardEntry {
    rank: number
    userId: number
    username: string
    score: number
}

export interface ScoreboardResponse {
    period: ScoreboardPeriod
    scoreboard: ScoreboardEntry[]
    own: ScoreboardEntry | null
}