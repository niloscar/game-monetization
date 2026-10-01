import { Router } from 'express'
import { authenticate, authorize } from '../../middleware/auth'

import adminAdRouter from './ad'
import adminGameRouter from './game'
import adminOrderRouter from './order'
import adminPowerUpRouter from './powerUp'
import adminProductRouter from './product'
import adminUserRouter from './user'

const adminRouter = Router()

adminRouter.use(authenticate)
adminRouter.use(authorize('admin'))

adminRouter.use('/ad', adminAdRouter)
adminRouter.use('/game', adminGameRouter)
adminRouter.use('/order', adminOrderRouter)
adminRouter.use('/power-up', adminPowerUpRouter)
adminRouter.use('/product', adminProductRouter)
adminRouter.use('/user', adminUserRouter)

export default adminRouter