/**
 * Power-up routes
 */

import { Router } from 'express'
import { getPowerUps } from './../controllers/powerUp'

const PowerUpRouter = Router()

PowerUpRouter.get('/', getPowerUps)

export default PowerUpRouter