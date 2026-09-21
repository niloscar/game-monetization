import type { Request } from 'express'

export function setSession(req: Request, userId: number): void {
    if (!userId || typeof userId !== 'number') {
        delete req.session?.userId
        return
    }
}

export function getSession(req: Request): number | undefined {
    if (!req.session) {
        throw new Error('Session is not initialized')
    }
    return req.session.userId
}