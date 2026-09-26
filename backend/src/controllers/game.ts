/**
 * Game controller
 */

import * as service from '../services/game'
import { validateField, validateId } from '../utils/validation'
import type { Request, Response } from 'express'
import type { ApiError } from '../types/errors'
import type { ScoreboardPeriod, ScoreboardResponse, Score } from '../types/game'

const VALID_PERIODS: ScoreboardPeriod[] = ['today', 'week', 'all']
const MAX_SCOREBOARD_SIZE = 50

/*------------------------------------------------------------------------------
 * Scores
 *------------------------------------------------------------------------------*/
export const getScores = async (_req: Request, res: Response<Score[]>) => {
    const scores = await service.getScores()
    res.status(200).json(scores)
}

export const getScore = async (req: Request<{ scoreId: string }>, res: Response<Score | ApiError>) => {
    const scoreId = Number(req.params.scoreId)

    const error = validateId('scoreId', scoreId)
    if (error) {
        res.status(400).json(error)
        return
    }

    const score = await service.getScore(scoreId)
    if (!score) {
        res.status(404).json({ message: 'Score hittades inte.' })
        return
    }

    res.status(200).json(score)
}

// TODO från tidigare, nu implementerad. OBS: öppen fråga — ska vem som
// helst inloggad kunna se en annan users alla scores, eller bara
// admin/sig själv? Just nu bara "kräver inloggning", samma nivå som
// resten av game-routes. Skärp med authorize('admin') om ni vill
// begränsa det.
export const getScoresByUserId = async (req: Request<{ userId: string }>, res: Response<Score[] | ApiError>) => {
    const userId = Number(req.params.userId)

    const error = validateId('userId', userId)
    if (error) {
        res.status(400).json(error)
        return
    }

    const scores = await service.getScoresByUserId(userId)
    res.status(200).json(scores)
}

// Samma sak som getScoresByUserId, fast för den inloggade själv —
// motsvarar users/me-mönstret i user-controllern. Det här är den
// ProfilePage ska använda.
export const getMyScores = async (req: Request, res: Response<Score[] | ApiError>) => {
    const userId = req.session.userId

    if (userId === undefined) {
        res.status(401).json({ message: 'Användaren är inte autentiserad.' })
        return
    }

    const scores = await service.getScoresByUserId(userId)
    res.status(200).json(scores)
}

export const createScore = async (req: Request, res: Response<Score | ApiError>) => {
    const userId = req.session.userId

    if (userId === undefined) {
        res.status(401).json({ message: 'Användaren är inte autentiserad.' })
        return
    }

    const { productId, score } = req.body ?? {}

    const productIdError = validateId('productId', productId)
    if (productIdError) {
        res.status(400).json(productIdError)
        return
    }

    const scoreError = validateField('score', score, 'number')
    if (scoreError) {
        res.status(400).json(scoreError)
        return
    }

    if (score < 0) {
        res.status(400).json({ message: 'Score kan inte vara negativt.', field: 'score' })
        return
    }

    const newScore = await service.createScore({ userId, productId, score })
    res.status(201).json(newScore)
}

export const deleteScore = async (req: Request<{ scoreId: string }>, res: Response<ApiError>) => {
    const scoreId = Number(req.params.scoreId)

    const error = validateId('scoreId', scoreId)
    if (error) {
        res.status(400).json(error)
        return
    }

    const deletedScore = await service.deleteScore(scoreId)
    if (!deletedScore) {
        res.status(404).json({ message: 'Score hittades inte.' })
        return
    }

    res.status(204).send()
}

/*------------------------------------------------------------------------------
 * Scoreboard
 *------------------------------------------------------------------------------*/

// Publik — funkar utloggad också (own blir bara null då), så ScorePage
// kan visa topplistan innan man loggat in, precis som mockversionen gjorde.
export const getScoreboard = async (req: Request, res: Response<ScoreboardResponse | ApiError>) => {
    const periodParam = typeof req.query.period === 'string' ? req.query.period : 'all'

    if (!VALID_PERIODS.includes(periodParam as ScoreboardPeriod)) {
        res.status(400).json({
            message: `period måste vara en av: ${VALID_PERIODS.join(', ')}`,
            field: 'period'
        })
        return
    }

    const period = periodParam as ScoreboardPeriod
    const fullScoreboard = await service.getScoreboard(period)

    // Slås upp mot den ofiltrerade listan INNAN den klipps till
    // MAX_SCOREBOARD_SIZE, så din egen rank stämmer även om du ligger
    // långt utanför topp 50 — samma princip som i ScorePage.tsx just nu.
    const userId = req.session.userId
    const own = userId !== undefined
        ? fullScoreboard.find((entry) => entry.userId === userId) ?? null
        : null

    res.status(200).json({
        period,
        scoreboard: fullScoreboard.slice(0, MAX_SCOREBOARD_SIZE),
        own
    })
}