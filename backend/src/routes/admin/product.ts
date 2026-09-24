/**
 * Admin product routes
 */

import { Router } from 'express'
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from '../../controllers/product'

const AdminProductRouter = Router()

AdminProductRouter.get('/', getProducts)
AdminProductRouter.get('/:id', getProduct)
AdminProductRouter.post('/', createProduct)
AdminProductRouter.patch('/:id', updateProduct)
AdminProductRouter.delete('/:id', deleteProduct)

export default AdminProductRouter