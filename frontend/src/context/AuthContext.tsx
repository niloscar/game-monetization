import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { AxiosError } from 'axios'
import api from '../api/apiClient'

export interface AuthUser {
    id: number
    username: string
    email: string
    role: 'user' | 'admin'
    tier: {
        id: number
        name: string
        description: string
        level: number
    } | null
    createdAt: string
}

const DEV_FAKE_USER =
    import.meta.env.DEV && import.meta.env.VITE_DEV_FAKE_USER === 'true'

const FAKE_USER: AuthUser = {
    id: 1,
    username: 'dev_user',
    email: 'dev@example.com',
    role: 'user',
    tier: { id: 3, name: 'High Score Access', description: '', level: 3 },
    createdAt: new Date().toISOString()
}

export interface UpdateProfileInput {
    username?: string
    email?: string
    password?: string
}

interface AuthContextType {
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

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function getErrorMessage(err: unknown, fallback: string): string {
    const axiosErr = err as AxiosError<{ message?: string }>
    return axiosErr.response?.data?.message ?? fallback
}

// -----------------------------------------------------------------------
// Provider
// -----------------------------------------------------------------------

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(
        DEV_FAKE_USER ? FAKE_USER : null
    )
    const [loading, setLoading] = useState(!DEV_FAKE_USER)
    const [error, setError] = useState<string | null>(null)

    async function refreshUser(): Promise<AuthUser | null> {
        try {
            const res = await api.get<AuthUser>('/user/me')
            setUser(res.data)
            return res.data
        } catch {
            setUser(null)
            return null
        }
    }

    useEffect(() => {
        if (DEV_FAKE_USER) return

        let cancelled = false

        async function checkSession() {
            try {
                const res = await api.get<AuthUser>('/user/me')
                if (!cancelled) setUser(res.data)
            } catch {
                if (!cancelled) setUser(null)
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        checkSession()
        return () => {
            cancelled = true
        }
    }, [])

    async function login(email: string, password: string) {
        setError(null)
        try {
            await api.post('/auth/login', { email, password })
            await refreshUser()
        } catch (err) {
            const message = getErrorMessage(err, 'Inloggning misslyckades')
            setError(message)
            throw new Error(message)
        }
    }

    async function register(username: string, email: string, password: string) {
        setError(null)
        try {
            await api.post('/user', { username, email, password })
            await login(email, password)
        } catch (err) {
            const message = getErrorMessage(err, 'Registrering misslyckades')
            setError(message)
            throw new Error(message)
        }
    }

    async function logout() {
        setError(null)
        try {
            await api.post('/auth/logout')
        } finally {
            setUser(null)
        }
    }

    async function updateProfile(data: UpdateProfileInput) {
        setError(null)

        if (DEV_FAKE_USER) {
            setUser((prev) => {
                if (!prev) return prev
                const { username, email } = data
                return {
                    ...prev,
                    ...(username ? { username } : {}),
                    ...(email ? { email } : {})
                }
            })
            return
        }

        if (!user) throw new Error('Ingen inloggad användare')

        try {
            await api.patch('/user/me', data)
            await refreshUser()
        } catch (err) {
            const message = getErrorMessage(
                err,
                'Kunde inte uppdatera profilen'
            )
            setError(message)
            throw new Error(message)
        }
    }

    const value: AuthContextType = {
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated: user !== null,
        isAdmin: user?.role === 'admin'
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// -----------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth måste användas inuti en <AuthProvider>')
    }
    return context
}
