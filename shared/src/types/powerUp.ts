export interface PowerUp {
    id: number
    key: string
    name: string
    description: string | null
    imageUrl: string | null
    isActive: boolean
    width: number
    height: number
    healthDelta: number
    scoreDelta: number
    speedMultiplier: number
    scoreMultiplier: number
    durationSeconds: number
    spawnWeight: number
}