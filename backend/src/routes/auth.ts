/**
 * Authentication routes.
 */

import { Router } from 'express'
import { login, logout, getCurrentUser, getSession } from '../controllers/auth'

const authRouter = Router()

authRouter.post('/login', login)
authRouter.post('/logout', logout)
authRouter.get('/me', getCurrentUser)
authRouter.get('/session', getSession)

export default authRouter