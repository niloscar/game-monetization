/**
 * Game routes
 */

import { Router } from 'express'

const gameRoutes = Router()

gameRoutes.get('/score', (req, res) => {
  // Handle fetching the game score logic here
  res.json({ message: 'Get game score route' })
})

gameRoutes.post('/score', (req, res) => {
  // Handle adding new game score logic here
  res.json({ message: 'Add game score route' })
})

gameRoutes.get('/score/:id', (req, res) => {
  // Handle fetching a specific game score by ID logic here
  const { id } = req.params
  res.json({ message: `Get game score with ID ${id} route` })
})

gameRoutes.delete('/score/:id', (req, res) => {
  // Handle deleting a specific game score by ID logic here
  const { id } = req.params
  res.json({ message: `Delete game score with ID ${id} route` })
})

export default gameRoutes