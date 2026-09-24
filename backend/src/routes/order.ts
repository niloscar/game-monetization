/**
 * Order routes
 */

import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import { createOrder, getOrder, getOrders } from '../controllers/order'

const orderRouter = Router()

orderRouter.use(authenticate) // Check if the user is authenticated for all routes below

orderRouter.get('/', getOrders)
orderRouter.get('/:id', getOrder)
orderRouter.post('/', createOrder)

export default orderRouter