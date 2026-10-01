export type { PowerUp } from '@assignment/shared/types/powerUp'

export interface CreatePowerUpBody {
    name: string
    key: string
    description?: string | null
    imageUrl?: string | null
    isActive?: boolean
    width?: number
    height?: number
    healthDelta?: number
    scoreDelta?: number
    speedMultiplier?: number
    scoreMultiplier?: number
    durationSeconds?: number
    spawnWeight?: number
    productIds?: number[]
}

export interface UpdatePowerUpBody {
    name?: string
    key?: string
    description?: string | null
    imageUrl?: string | null
    isActive?: boolean
    width?: number
    height?: number
    healthDelta?: number
    scoreDelta?: number
    speedMultiplier?: number
    scoreMultiplier?: number
    durationSeconds?: number
    spawnWeight?: number
}