/**
 * Authentication routes.
 */

import { Router } from 'express'
import { login, logout, getSession } from '../controllers/auth'
import { getCurrentAuthUser } from '../controllers/user'

const authRouter = Router()

authRouter.post('/login', login)
authRouter.post('/logout', logout)
authRouter.get('/me', getCurrentAuthUser)
authRouter.get('/session', getSession)

export default authRouter