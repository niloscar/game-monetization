// Pizza Arcade — delade typer för mockdata
// Matchar endpoints: Ad, Auth, Game (score), Order, User, Product

export type TierSlug = 'quarter-pass' | 'combo-pass' | 'high-score-access'

export type UserRole = 'user' | 'admin'

export interface Tier {
    id: string
    slug: TierSlug
    name: string
    priceKr: number
    order: number // 1 = lägst, 3 = högst — för att jämföra nivåer
    color: string // hex, matchar stilguiden
    adFrequency: 'high' | 'medium' | 'none'
    features: string[]
}

export interface User {
    id: string
    username: string
    email: string
    passwordHash: string // mockat, aldrig en riktig hash
    role: UserRole
    tierId: string
    createdAt: string // ISO 8601
}

export interface Ad {
    id: string
    title: string
    imageUrl: string
    tierVisibility: TierSlug[] // vilka nivåer som ser denna annons
    weight: number // hur ofta den visas relativt andra annonser
}

export interface Score {
    id: string
    userId: string
    value: number
    playtimeSeconds: number
    track: string
    createdAt: string
}

export type OrderStatus = 'pending' | 'completed' | 'failed' | 'cancelled'

export interface Order {
    id: string
    userId: string
    tierId: string
    status: OrderStatus
    amountKr: number
    createdAt: string
}

export interface Receipt {
    id: string
    orderId: string
    userId: string
    tierId: string
    amountKr: number
    issuedAt: string
}

export interface Product {
    id: string
    title: string
    content: string
    requiredTierId: string
    authorId: string // admin som skapade sidan
    createdAt: string
    updatedAt: string
}
