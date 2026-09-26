/**
 * Auth controller
 */

import { verifyPassword, hashPassword } from '../utils/password'
import { validateField } from '../utils/validation'
import type { Request, Response } from 'express'
import type { ApiError } from '../types/errors'
import { getAuthCredentialsByEmail } from '../services/auth'
import { getUser } from '../services/user'
import type { User } from '../types/user'

interface LoginRequestBody {
    email: string
    password: string
}

export const login = async (
    req: Request<{}, ApiError, LoginRequestBody>,
    res: Response<ApiError | User>
) => {
    const { email, password } = req.body ?? {}

    const emailError = validateField('email', email, 'string')
    if (emailError) {
        res.status(400).json(emailError)
        return
    }

    const passwordError = validateField('password', password, 'string')
    if (passwordError) {
        res.status(400).json(passwordError)
        return
    }

    const user = await getAuthCredentialsByEmail(email)

    if (!user) {
        res.status(401).json({ message: 'Fel e-post eller lösenord.' })
        return
    }

    const isPasswordValid = await verifyPassword(user.passwordHash, password)

    if (!isPasswordValid) {
        res.status(401).json({ message: 'Fel e-post eller lösenord.' })
        return
    }

    req.session.regenerate(async(error) => {
        if (error) {
            res.status(500).json({ message: 'Kunde inte skapa session.' })
            return
        }

        req.session.userId = user.id

        const authUser = await getUser(user.id)

        if (!authUser) {
            res.status(500).json({ message: 'Kunde inte hämta användaren.' })
            return
        }

        res.status(200).json(authUser)
    })
}

export const logout = (req: Request, res: Response<ApiError>) => {
    req.session.destroy((error) => {
        if (error) {
            res.status(500).json({ message: 'Kunde inte logga ut.' })
            return
        }

        res.clearCookie('connect.sid')
        res.status(204).send()
    })
}