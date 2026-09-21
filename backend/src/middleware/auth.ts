import type { NextFunction, Request, Response } from "express"
import * as service from "../services/auth"

export function authenticate(req: Request, res: Response, next: NextFunction) {
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: 'Användaren är inte autentiserad.' })
    }
    next()
}

export function authorize(role: string) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.session.userId

        if (userId === undefined) {
            res.status(401).json({ message: 'Användaren är inte autentiserad.' })
            return
        }

        try {
            const userRole = await service.getAuthRole(userId)

            if (userRole === null) {
                res.status(401).json({ message: 'Användaren är inte autentiserad.' })
                return
            }

            if (userRole !== role) {
                res.status(403).json({ message: 'Du saknar behörighet.' })
                return
            }

            next()
        } catch (error) {
            next(error)
        }
    }
}