/**
 * Product routes
 */

import { Router } from 'express'
import { getProduct, getProducts } from '../controllers/product'

const productRouter = Router()

productRouter.get('/', getProducts)
productRouter.get('/:id', getProduct)

export default productRouter