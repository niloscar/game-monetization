import { Router } from 'express'
import { getUsers, getUser, updateUser, deleteUser } from '../../controllers/user'
import { authenticate, authorize } from '../../middleware/auth'

const adminUserRouter = Router()

adminUserRouter.use(authenticate)
adminUserRouter.use(authorize('admin'))

adminUserRouter.get('/', getUsers)
adminUserRouter.get('/:id', getUser)
adminUserRouter.patch('/:id', updateUser)
adminUserRouter.delete('/:id', deleteUser)

export default adminUserRouter