/**
 * Auth controller
 */

import type { Request, Response } from 'express'

interface LoginRequestBody {
    email: string
    password: string
}

interface PublicUser {
    email: string
}

interface SessionInfo {
    userId: number
}

const MOCK_USERS = [
    {
        email: 'user1@example.com',
        password_hash: 'password1'
    },
    {
        email: 'user2@example.com',
        password_hash: 'password2'
    }
]

export const login = (req: Request<LoginRequestBody>, res: Response<{ message: string }>) => {
    const { email, password } = req.body

    if (!email || !password) {
        res.status(400).json({ message: 'E-post och lösenord krävs.' })
        return
    }

    if (typeof email !== 'string' || typeof password !== 'string') {
        res.status(400).json({ message: 'E-post och lösenord måste vara strängar.' })
        return
    }

    const user = MOCK_USERS.find((user) => user.email === email && user.password_hash === password)

    if (!user) {
        res.status(401).json({ message: 'Fel e-post eller lösenord.' })
        return
    }

    res.json({ message: 'Login-route' })
}

export const logout = (_req: Request, res: Response<{ message: string }>) => {
    res.json({ message: 'Logout-route' })
}

export const getCurrentUser = (_req: Request, res: Response<{ message: string }>) => {
    res.json({ message: 'Me-route' })
}

export const getSession = (_req: Request, res: Response<{ message: string }>) => {
    res.json({ message: 'Session-route' })
}