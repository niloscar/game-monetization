import type { PowerUp } from './powerUp'

export interface Feature {
    id: number
    key: string
    name: string
    description: string | null
}

export interface Tier {
    id: number
    level: number
}

export interface Product {
    id: number
    name: string
    description: string | null
    isPurchasable: boolean
    price: number | null
    tier: Tier | null
    features: Feature[]
    powerUps: PowerUp[]
}

export interface CreateProductBody {
    name: string
    description?: string | null
    price: number
    isPurchasable?: boolean
    tierLevel?: number | null
    featureIds?: number[]
    powerUpIds?: number[]
}

export interface UpdateProductBody {
    name?: string
    description?: string | null
    price?: number
    isPurchasable?: boolean
    tierLevel?: number | null
    featureIds?: number[]
    powerUpIds?: number[]
}