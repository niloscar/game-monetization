/**
 * Authentication routes.
 */

import { Router } from 'express'
import { login, logout } from '../controllers/auth'
import { getCurrentUser } from '../controllers/user'


const authRouter = Router()

authRouter.post('/login', login)
authRouter.post('/logout', logout)
authRouter.get('/me', getCurrentUser)

export default authRouter