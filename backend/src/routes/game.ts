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
} from '../controllers/game'

const gameRouter = Router()

gameRouter.get('/scoreboard', getScoreboard)

gameRouter.use(authenticate)

gameRouter.get('/score/me', getMyScores)
gameRouter.get('/score/user/:userId', getScoresByUserId)
gameRouter.get('/score/:scoreId', getScore)
gameRouter.post('/score', createScore)

export default gameRouter