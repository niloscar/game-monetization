import type { PowerUp } from './powerUp'
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

export type ScoreboardAccess = 'none' | 'top3' | 'full'

export interface GameAccess {
    canSaveScore: boolean
    showCurrentScore: boolean
    showPersonalHighScore: boolean
    scoreboardAccess: ScoreboardAccess
    showOwnRanking: boolean
    ads: {
        preGame: boolean
        display: boolean
    }
    powerUps: PowerUp[]
}