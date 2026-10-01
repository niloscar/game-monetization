import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { AxiosError } from 'axios'
import api from '../api/apiClient'
import { AuthContext } from './AuthContext'
import type { AuthUser, UpdateProfileInput, AuthContextType } from './AuthContext'

const DEV_FAKE_USER =
    import.meta.env.DEV && import.meta.env.VITE_DEV_FAKE_USER === 'true'

const FAKE_USER: AuthUser = {
    id: 1,
    username: 'dev_user',
    email: 'dev@example.com',
    role: {
        id: 1,
        name: 'user',
        description: ''
    },
    tier: { id: 3, name: 'High Score Access', description: '', level: 3 },
    createdAt: new Date().toISOString()
}

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
            const res = await api.get<AuthUser | null>('/auth/me')
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
                const res = await api.get<AuthUser | null>('/auth/me')
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
            throw new Error(message, { cause: err })
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
            throw new Error(message, { cause: err })
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
            throw new Error(message, { cause: err })
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
        isAdmin: user?.role.name === 'admin'
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}