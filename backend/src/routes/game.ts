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
    getGameAccess,
    getMyHighScore,
} from '../controllers/game'

const gameRouter = Router()

gameRouter.get('/access', getGameAccess)

gameRouter.use(authenticate)

gameRouter.get('/scoreboard', getScoreboard)
gameRouter.get('/score/me', getMyScores)
gameRouter.get('/score/me/high-score', getMyHighScore)
gameRouter.get('/score/user/:userId', getScoresByUserId)
gameRouter.get('/score/:scoreId', getScore)
gameRouter.post('/score', createScore)

export default gameRouter