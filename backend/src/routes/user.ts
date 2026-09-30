/**
 * User routes
 */

import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import {
    getCurrentUser,
    updateCurrentUser,
    createUser,
    getPublicUserProfile
} from '../controllers/user'

const userRouter = Router()

userRouter.post('/', createUser)

userRouter.use(authenticate) // Check if the user is authenticated for all routes below

userRouter.get('/me', getCurrentUser)
userRouter.patch('/me', updateCurrentUser)

userRouter.get('/username/:username', getPublicUserProfile)

export default userRouter
