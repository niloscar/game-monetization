import type { Request, Response } from 'express'

export function notFoundHandler(req: Request, res: Response) {
    res.status(404).json({
        error: 'Endpoint hittades inte',
        message: `${req.method} ${req.originalUrl} matchar ingen API-route.`
    })
}