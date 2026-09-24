/**
 * User routes
 */

import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import { getMe, updateMe, createUser } from '../controllers/user'

const userRouter = Router()

userRouter.post('/', createUser)

userRouter.use(authenticate) // Check if the user is authenticated for all routes below

userRouter.get('/me', getMe)
userRouter.patch('/me', updateMe)

export default userRouter