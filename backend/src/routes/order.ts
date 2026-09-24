/**
 * Order routes
 */

import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import { createOrder, getCurrentUserOrders, getCurrentUserOrder } from '../controllers/order'

const orderRouter = Router()

orderRouter.use(authenticate) // Check if the user is authenticated for all routes below

orderRouter.get('/', getCurrentUserOrders)
orderRouter.get('/:id', getCurrentUserOrder)
orderRouter.post('/', createOrder)

export default orderRouter