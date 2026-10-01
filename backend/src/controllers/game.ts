/**
 * Game controller
 */

import type { Request, Response } from 'express'
import * as service from '../services/game'
import { validateField, validateId } from '../utils/validation'
import type { ApiError } from '../types/errors'
import type { CreateScoreBody, GameAccess, Score, ScoreboardPeriod, ScoreboardResponse } from '../types/game'

export const getScores = async (_req: Request, res: Response<Score[] | ApiError>) => {
    const scores = await service.getScores()

    res.status(200).json(scores)
}

export const getScoresByUserId = async (
    req: Request<{ id: string }>,
    res: Response<Score[] | ApiError>
) => {
    const userId = Number(req.params.id)

    const idError = validateId('id', userId)
    if (idError) {
        res.status(400).json(idError)
        return
    }

    const scores = await service.getScoresByUserId(userId)

    res.status(200).json(scores)
}

export const getMyScores = async (
    req: Request,
    res: Response<Score[] | ApiError>
) => {
    const userId = req.session.userId!

    const scores = await service.getScoresByUserId(userId)

    res.status(200).json(scores)
}

export const getMyHighScore = async (
    req: Request,
    res: Response<Score | null | ApiError>
) => {
    const userId = req.session.userId!
    const access = await service.getGameAccess(userId)

    if (!access.showPersonalHighScore) {
        res.status(403).json({ message: 'Du har inte tillgång till personlig high score.' })
        return
    }

    const highScore = await service.getHighScoreByUserId(userId)

    res.status(200).json(highScore)
}

export const getScore = async (
    req: Request<{ id: string }>,
    res: Response<Score | ApiError>
) => {
    const scoreId = Number(req.params.id)

    const idError = validateId('id', scoreId)
    if (idError) {
        res.status(400).json(idError)
        return
    }

    const score = await service.getScore(scoreId)

    if (!score) {
        res.status(404).json({ message: 'Poängen hittades inte.' })
        return
    }

    res.status(200).json(score)
}

export const createScore = async (
    req: Request<{}, {}, CreateScoreBody>,
    res: Response<Score | ApiError>
) => {
    const userId = req.session.userId!
    const { score } = req.body

    const scoreError = validateField('score', score, 'number')
    if (scoreError) {
        res.status(400).json(scoreError)
        return
    }

    const newScore = await service.createScore({ userId, score })

    if (!newScore) {
        res.status(403).json({ message: 'Du har ingen produkt som tillåter sparade resultat.' })
        return
    }

    res.status(201).json(newScore)
}

export const deleteScore = async (
    req: Request<{ id: string }>,
    res: Response<ApiError>
) => {
    const scoreId = Number(req.params.id)

    const idError = validateId('id', scoreId)
    if (idError) {
        res.status(400).json(idError)
        return
    }

    const deletedScore = await service.deleteScore(scoreId)

    if (!deletedScore) {
        res.status(404).json({ message: 'Poängen hittades inte.' })
        return
    }

    res.status(204).send()
}

const MAX_SCOREBOARD_SIZE = 50
const VALID_PERIODS: ScoreboardPeriod[] = ['today', 'week', 'all']

export const getScoreboard = async (
    req: Request,
    res: Response<ScoreboardResponse | ApiError>
) => {
    const periodParam =
        typeof req.query.period === 'string' ? req.query.period : 'all'

    if (!VALID_PERIODS.includes(periodParam as ScoreboardPeriod)) {
        res.status(400).json({ message: 'Ogiltig period.', field: 'period' })
        return
    }

    const period = periodParam as ScoreboardPeriod
    const access = await service.getGameAccess(req.session.userId)

    console.log('User access:', access)

    if (access.scoreboardAccess === 'none') {
        res.status(403).json({ message: 'Du har inte tillgång till topplistan.' })
        return
    }

    const fullBoard = await service.getScoreboard(period)

    const scoreboard =
        access.scoreboardAccess === 'top3'
            ? fullBoard.slice(0, 3)
            : fullBoard

    const userId = req.session.userId
    const own =
        access.showOwnRanking && userId !== undefined
            ? (fullBoard.find((entry) => entry.userId === userId) ?? null)
            : null

    res.status(200).json({
        period,
        scoreboard,
        own
    })
}

export const getGameAccess = async (
    req: Request,
    res: Response<GameAccess>
) => {
    const access = await service.getGameAccess(req.session.userId)

    res.status(200).json(access)
}