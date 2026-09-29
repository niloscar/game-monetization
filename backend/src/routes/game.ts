/**
 * Game routes
 */

import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import {
    getScore,
    getScoresByUserId,
    getMyScores,
    createScore,
    getScoreboard,
    getAdPolicy,
} from '../controllers/game'

const gameRouter = Router()

gameRouter.get('/scoreboard', getScoreboard)

gameRouter.use(authenticate)

gameRouter.get('/score/me', getMyScores)
gameRouter.get('/score/user/:userId', getScoresByUserId)
gameRouter.get('/score/:scoreId', getScore)
gameRouter.post('/score', createScore)

gameRouter.get('/ad-policy', getAdPolicy)

export default gameRouter