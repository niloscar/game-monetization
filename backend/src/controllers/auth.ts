/**
 * Auth controller
 */

import type { Request, Response } from 'express'

interface LoginRequestBody {
    email: string
    password: string
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
    if (!req.body.email || !req.body.password) {
        res.status(400).json({ message: 'Email and password are required' })
        return
    }

    if (typeof req.body.email !== 'string' || typeof req.body.password !== 'string') {
        res.status(400).json({ message: 'Email and password must be strings' })
        return
    }

    const user = MOCK_USERS.find(
        (user) => user.email === req.body.email && user.password_hash === req.body.password
    )

    if (!user) {
        res.status(401).json({ message: 'Invalid email or password' })
        return
    }

    res.json({ message: 'Login route' })
}

export const logout = (_req: Request, res: Response<{ message: string }>) => {
    res.json({ message: 'Logout route' })
}

export const getCurrentUser = (_req: Request, res: Response<{ message: string }>) => {
    res.json({ message: 'Current user route' })
}

export const getSessionInfo = (_req: Request, res: Response<{ message: string }>) => {
    res.json({ message: 'Session info route' })
}