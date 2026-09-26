/**
 * Admin order routes
 */

import { Router } from 'express'
import { getOrder, getOrders, updateOrder, deleteOrder } from '../../controllers/order'

const adminOrderRouter = Router()

adminOrderRouter.get('/', getOrders)
adminOrderRouter.get('/:id', getOrder)
adminOrderRouter.patch('/:id', updateOrder)
adminOrderRouter.delete('/:id', deleteOrder)

export default adminOrderRouter