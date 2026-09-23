/**
 * Auth controller
 */

import { verifyPassword, hashPassword } from '../utils/password'
import { validateField } from '../utils/validation'
import type { Request, Response } from 'express'
import type { ApiError } from '../types/errors'
import { getAuthCredentialsByEmail } from '../services/auth'
import type { CreateUserBody } from '../types/user'
import { createUser } from '../services/user'

interface LoginRequestBody {
    email: string
    password: string
}

export const login = async (req: Request<{}, ApiError, LoginRequestBody>, res: Response<ApiError>) => {
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

    console.log('User credentials:', user.passwordHash)

    const isPasswordValid = await verifyPassword(user.passwordHash, password)

    if (!isPasswordValid) {
        res.status(401).json({ message: 'Fel e-post eller lösenord.' })
        return
    }

    req.session.regenerate((error) => {
        if (error) {
            res.status(500).json({ message: 'Kunde inte skapa session.' })
            return
        }

        req.session.userId = user.id

        res.status(204).send()
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

export const getMe = (_req: Request, res: Response<ApiError>) => {
    res.json({ message: 'Me-route' })
}

export const getSession = (_req: Request, res: Response<ApiError>) => {
    res.json({ message: 'Session-route' })
}

export const register = async (
    req: Request<{}, ApiError, CreateUserBody>,
    res: Response<ApiError>
) => {
    const { username, email, password } = req.body ?? {}

    const usernameError = validateField('username', username, 'string')
    if (usernameError) {
        res.status(400).json(usernameError)
        return
    }

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

    if (password.length < 8) {
    res.status(400).json({
        message: 'Lösenordet måste vara minst 8 tecken.',
        field: 'password'
    })
    return
}

    const passwordHash = await hashPassword(password)

 let user

try {
    user = await createUser({
        username,
        email,
        passwordHash,
        roleId: 1
    })
} catch (error) {
    console.error(error)

     res.status(409).json({
        message: 'E-postadressen används redan.',
        field: 'email'
    })

   return

}
res.status(201).json(user)

}