/**
 * Product routes
 */

import { Router } from 'express'

const productRoutes = Router()

productRoutes.get('/', (req, res) => {
  // Handle fetching all products logic here
  res.json({ message: 'Get all products route' })
})

productRoutes.get('/:id', (req, res) => {
  // Handle fetching a specific product by ID logic here
  const { id } = req.params
  res.json({ message: `Get product with ID ${id} route` })
})

productRoutes.post('/', (req, res) => {
  // Handle creating a new product logic here
  res.json({ message: 'Create new product route' })
})

productRoutes.patch('/:id', (req, res) => {
  // Handle updating a specific product by ID logic here
  const { id } = req.params
  res.json({ message: `Update product with ID ${id} route` })
})

productRoutes.delete('/:id', (req, res) => {
  // Handle deleting a specific product by ID logic here
  const { id } = req.params
  res.json({ message: `Delete product with ID ${id} route` })
})

export default productRoutes