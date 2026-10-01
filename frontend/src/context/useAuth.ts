import { useContext } from 'react'
import { AuthContext } from './AuthContext'
import type { AuthContextType } from './AuthContext'

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth måste användas inuti en <AuthProvider>')
    }
    return context
}
