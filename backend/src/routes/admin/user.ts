/**
 * Admin user routes
 */

import { Router } from 'express'
import { getUsers, getUser, updateUser, deleteUser } from '../../controllers/user'

const adminUserRouter = Router()

adminUserRouter.get('/', getUsers)
adminUserRouter.get('/:id', getUser)
adminUserRouter.patch('/:id', updateUser)
adminUserRouter.delete('/:id', deleteUser)

export default adminUserRouter