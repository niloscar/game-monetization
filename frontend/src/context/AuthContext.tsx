import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { AxiosError } from 'axios'
import api from '../api/apiClient'
import type { User } from '../mock/types'

// OBS: passwordHash ska ALDRIG komma tillbaka från backend till frontend.
// AuthUser är samma User-typ minus det fältet.
export type AuthUser = Omit<User, 'passwordHash'>

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
    const [user, setUser] = useState<AuthUser | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Vid appstart: kolla om det redan finns en aktiv session (cookie)
    useEffect(() => {
        let cancelled = false

        async function checkSession() {
            try {
                const res = await api.get<AuthUser>('/auth/me')
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
            const res = await api.post<AuthUser>('/auth/login', {
                email,
                password
            })
            setUser(res.data)
        } catch (err) {
            const message = getErrorMessage(err, 'Inloggning misslyckades')
            setError(message)
            throw new Error(message)
        }
    }

    async function register(username: string, email: string, password: string) {
        setError(null)
        try {
            // OBS: registrering går via User-endpointen (POST /api/users), inte /auth
            const res = await api.post<AuthUser>('/users', {
                username,
                email,
                password
            })
            setUser(res.data)
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
            // Nollställ användaren oavsett om servern svarade OK,
            // så UI:t aldrig fastnar i inloggat läge
            setUser(null)
        }
    }

    const value: AuthContextType = {
        user,
        loading,
        error,
        login,
        register,
        logout,
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
