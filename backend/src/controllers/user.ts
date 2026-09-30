/**
 * User controller
 */

import * as service from '../services/user'
import { validateField, validateId } from '../utils/validation'
import { hashPassword } from '../utils/password'
import type { Request, Response } from 'express'
import type { DatabaseError } from 'pg'
import type { ApiError } from '../types/errors'
import type { CreateUserBody, UpdateUserData, User } from '../types/user'

const NEW_USER_DEFAULT_ROLE_ID = 1
// const NEW_USER_DEFAULT_TIER_ID = null

export const getCurrentUser = async (
    req: Request,
    res: Response<User | ApiError>
) => {
    const user = await service.getUser(req.session.userId!)

    if (!user) {
        res.status(404).json({ message: 'Användaren hittades inte.' })
        return
    }

    res.status(200).json(user)
}

export const updateCurrentUser = async (
    req: Request,
    res: Response<User | ApiError>
) => {
    const id = req.session.userId

    if (!id) {
        res.status(401).json({ message: 'Användaren är inte autentiserad.' })
        return
    }

    const { username, email, password } = req.body ?? {}

    if ([username, email, password].every((value) => value === undefined)) {
        res.status(400).json({
            message: 'Minst ett fält måste anges.'
        })
        return
    }

    if (username !== undefined) {
        const error = validateField('username', username, 'string')
        if (error) {
            res.status(400).json(error)
            return
        }
    }

    if (email !== undefined) {
        const error = validateField('email', email, 'string')
        if (error) {
            res.status(400).json(error)
            return
        }
    }

    if (password !== undefined) {
        const error = validateField('password', password, 'string')
        if (error) {
            res.status(400).json(error)
            return
        }
    }

    const data: UpdateUserData = {
        username,
        email
    }

    if (password !== undefined) data.passwordHash = await hashPassword(password)

    const updatedUser = await service.updateUser(id, data)

    if (!updatedUser) {
        res.status(404).json({ message: 'Användaren hittades inte.' })
        return
    }

    res.status(200).json(updatedUser)
}

export const getUsers = async (_req: Request, res: Response<User[]>) => {
    const users = await service.getUsers()

    res.status(200).json(users)
}

export const getUser = async (
    req: Request<{ id: string }>,
    res: Response<User | ApiError>
) => {
    const id = Number(req.params.id)

    const error = validateId('id', id)
    if (error) {
        res.status(400).json(error)
        return
    }

    const user = await service.getUser(id)
    if (!user) {
        res.status(404).json({ message: 'Användare hittades inte.' })
        return
    }

    res.status(200).json(user)
}

export const getPublicUserProfile = async (
    req: Request<{ username: string }>,
    res: Response<Omit<User, 'email'> | ApiError>
) => {
    const { username } = req.params

    if (!username) {
        res.status(400).json({ message: 'Användarnamn måste anges.' })
        return
    }

    const user = await service.getPublicUserByUsername(username)
    if (!user) {
        res.status(404).json({ message: 'Användare hittades inte.' })
        return
    }

    res.status(200).json(user)
}

export const createUser = async (
    req: Request<{}, {}, CreateUserBody>,
    res: Response<User | ApiError>
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

    try {
        const passwordHash = await hashPassword(password)

        const newUser = await service.createUser({
            username,
            email,
            passwordHash,
            roleId: NEW_USER_DEFAULT_ROLE_ID
        })

        res.status(201).json(newUser)
    } catch (error) {
        const dbError = error as DatabaseError

        if (dbError.code === '23505') {
            if (dbError.constraint === 'uq_users_email_lower') {
                res.status(409).json({
                    message:
                        'E-postadressen används redan av en annan användare.',
                    field: 'email'
                })
                return
            }

            if (dbError.constraint === 'uq_users_username_lower') {
                res.status(409).json({
                    message:
                        'Användarnamnet används redan av en annan användare.',
                    field: 'username'
                })
                return
            }
        }

        throw error
    }
}

export const updateUser = async (
    req: Request<{ id: string }>,
    res: Response<User | ApiError>
) => {
    const id = Number(req.params.id)
    const { username, email, password, roleId } = req.body ?? {}

    const idError = validateId('id', id)
    if (idError) {
        res.status(400).json(idError)
        return
    }

    if (
        [username, email, password, roleId].every(
            (value) => value === undefined
        )
    ) {
        res.status(400).json({
            message: 'Minst ett fält måste anges.'
        })
        return
    }

    if (username !== undefined) {
        const error = validateField('username', username, 'string')
        if (error) {
            res.status(400).json(error)
            return
        }
    }

    if (email !== undefined) {
        const error = validateField('email', email, 'string')
        if (error) {
            res.status(400).json(error)
            return
        }
    }

    if (password !== undefined) {
        const error = validateField('password', password, 'string')
        if (error) {
            res.status(400).json(error)
            return
        }
    }

    if (roleId !== undefined) {
        const error = validateId('roleId', roleId)
        if (error) {
            res.status(400).json(error)
            return
        }
    }

    const data: UpdateUserData = { username, email, roleId }

    if (password !== undefined) data.passwordHash = await hashPassword(password)

    const updatedUser = await service.updateUser(id, data)

    if (!updatedUser) {
        res.status(404).json({ message: 'Användaren hittades inte.' })
        return
    }

    res.status(200).json(updatedUser)
}

export const deleteUser = async (
    req: Request<{ id: string }>,
    res: Response<ApiError>
) => {
    const id = Number(req.params.id)

    const error = validateId('id', id)
    if (error) {
        res.status(400).json(error)
        return
    }

    const deletedUser = await service.deleteUser(id)

    if (!deletedUser) {
        res.status(404).json({ message: 'Användaren hittades inte.' })
        return
    }

    res.status(204).send()
}

export const updateUserPassword = async (
    req: Request<{ id: string }>,
    res: Response<User | ApiError>
) => {
    const id = Number(req.session.userId)
    const { password } = req.body ?? {}

    const idError = validateId('id', id)
    if (idError) {
        res.status(400).json(idError)
        return
    }

    if (password === undefined) {
        res.status(400).json({
            message: 'Lösenord måste anges.',
            field: 'password'
        })
        return
    }

    const passwordError = validateField('password', password, 'string')
    if (passwordError) {
        res.status(400).json(passwordError)
        return
    }

    const passwordHash = await hashPassword(password)

    const updatedUser = await service.updateUser(id, { passwordHash })

    if (!updatedUser) {
        res.status(404).json({ message: 'Användaren hittades inte.' })
        return
    }

    res.status(200).json(updatedUser)
}
