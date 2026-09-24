/**
 * Game routes
 */

import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import { getScores, getScore, createScore } from '../controllers/game'

const gameRouter = Router()

gameRouter.use(authenticate) // Check if the user is authenticated for all routes below

gameRouter.get('/score', getScores)
gameRouter.get('/score/:id', getScore)
gameRouter.post('/score', createScore)

export default gameRouter