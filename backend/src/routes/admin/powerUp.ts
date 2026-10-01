/**
 * Admin power-up routes
 */

import { Router } from 'express'
import { getPowerUps, getPowerUp, createPowerUp, updatePowerUp, deletePowerUp } from '../../controllers/powerUp'
import uploadPowerUp from '../../middleware/uploadPowerUp'

const AdminPowerUpRouter = Router()

AdminPowerUpRouter.get('/', getPowerUps)
AdminPowerUpRouter.get('/:id', getPowerUp)
AdminPowerUpRouter.post('/', uploadPowerUp.single('image'), createPowerUp)
AdminPowerUpRouter.patch('/:id', updatePowerUp)
AdminPowerUpRouter.delete('/:id', deletePowerUp)

export default AdminPowerUpRouter