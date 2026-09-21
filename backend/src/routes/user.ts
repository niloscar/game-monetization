/**
 * User routes
 */

import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import { getMe, updateMe } from '../controllers/user'

const userRouter = Router()

userRouter.use(authenticate)

userRouter.get('/me', getMe)
userRouter.patch('/me', updateMe)

export default userRouter