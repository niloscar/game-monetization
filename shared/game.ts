export interface Game {
    sessionId: string
    powerUps: string[]
    onGameOver: (score: number) => void
    onExit: () => void
}
