export interface Product {
    id: string
    name: string
    description: string | null
    isPurchasable: boolean
    isMostPopular: boolean
    price: number | null
    tier: ProductTier | null
    features: ProductFeature[]
    powerUps: ProductPowerUp[]
}

interface ProductFeature {
    id: number
    name: string
    key: string
    description: string | null
}

interface ProductPowerUp {
    id: number
    name: string
    description: string | null
    price: number | null
}

interface ProductTier {
    id: number
    level: number
}