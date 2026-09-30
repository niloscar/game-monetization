export interface Product {
    id: number
    name: string
    description: string | null
    isPurchasable: boolean
    isMostPopular: boolean
    price: number | null
    features: {
        id: number
        name: string
        description: string | null
    }[]
    powerUps: {
        id: number
        name: string
        description: string | null
        price: number | null
    }[]
}