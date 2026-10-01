export type LeaderboardAccess = 'none' | 'top3' | 'full'

export interface GameAccess {
    canSaveScore: boolean
    showCurrentScore: boolean
    showPersonalHighScore: boolean
    leaderboardAccess: LeaderboardAccess
    showOwnRanking: boolean
    ads: {
        preGame: boolean
        display: boolean
    }
}