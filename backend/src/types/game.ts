export interface Score {
    id: number
    userId: number
    productId: number
    tierLevelSnapshot: number
    score: number
    createdAt: Date
}

export interface CreateScoreBody {
    score: number
}