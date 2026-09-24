import type { Request, Response, NextFunction } from 'express'
import type { ApiError } from '../types/errors'

export function errorHandler(error: unknown, _req: Request, res: Response<ApiError>, _next: NextFunction) {
    console.error(error)

    res.status(500).json({ message: 'Ett oväntat serverfel uppstod.' })
}