export interface User {
    id: string
    username: string
    email: string
    role: {
        id: number
        name: string
        description: string | null
    }
    tier: {
        id: number
        name: string
        description: string | null
        level: number
    } | null
    created_at: string
}
