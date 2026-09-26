/**
 * Admin game routes
 */

import Router from 'express'
import { getScores, getScore, createScore, deleteScore } from '../../controllers/game'

const adminGameRouter = Router()

adminGameRouter.get('/score', getScores)
adminGameRouter.get('/score/:id', getScore)
adminGameRouter.delete('/score/:id', deleteScore)

export default adminGameRouter