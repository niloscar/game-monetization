import type { PowerUp } from '@assignment/shared/types/powerUp'

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