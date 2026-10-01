import { createContext } from 'react'

export interface AuthUser {
    id: number
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
        description: string
        level: number
    } | null
    createdAt: string
}

export interface UpdateProfileInput {
    username?: string
    email?: string
    password?: string
}

export interface AuthContextType {
    user: AuthUser | null
    loading: boolean
    error: string | null
    login: (email: string, password: string) => Promise<void>
    register: (
        username: string,
        email: string,
        password: string
    ) => Promise<void>
    logout: () => Promise<void>
    updateProfile: (data: UpdateProfileInput) => Promise<void>
    isAuthenticated: boolean
    isAdmin: boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)