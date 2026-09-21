/**
 * User controller
 */

import type { Request, Response } from 'express'

export const getUsers = (_req: Request, res: Response<{ message: string }>) => {
    res.json({ message: 'Users-route' })
}

export const getUser = (req: Request<{ userId: string }>, res: Response<{ message: string }>) => {
    const { userId } = req.params
    res.json({ message: `User-route for userId: ${userId}` })
}

export const createUser = (req: Request, res: Response<{ message: string }>) => {
    res.json({ message: 'Create-user route' })
}

export const updateUser = (req: Request<{ userId: string }>, res: Response<{ message: string }>) => {
    const { userId } = req.params
    res.json({ message: `Update-user route for userId: ${userId}` })
}

export const deleteUser = (req: Request<{ userId: string }>, res: Response<{ message: string }>) => {
    const { userId } = req.params
    res.json({ message: `Delete-user route for userId: ${userId}` })
}