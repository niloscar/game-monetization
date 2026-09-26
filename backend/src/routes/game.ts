/**
 * Game routes
 */

import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import {
    getScores,
    getScore,
    getScoresByUserId,
    getMyScores,
    createScore,
    deleteScore,
    getScoreboard,
} from '../controllers/game'

const gameRoutes = Router()

// Publik — ScorePage ska kunna visa topplistan även utloggad.
gameRoutes.get('/scoreboard', getScoreboard)

gameRoutes.use(authenticate) // Allt nedanför kräver inloggning

// OBS ordning: /score/me och /score/user/:userId måste stå FÖRE
// /score/:scoreId, annars tolkar Express "me" som ett scoreId.
gameRoutes.get('/score', getScores)
gameRoutes.get('/score/me', getMyScores)
gameRoutes.get('/score/user/:userId', getScoresByUserId)
gameRoutes.get('/score/:scoreId', getScore)
gameRoutes.post('/score', createScore)
gameRoutes.delete('/score/:scoreId', deleteScore)

export default gameRoutes