/**
 * User routes
 */

import { Router } from 'express'

const userRouter = Router()

userRouter.get('/', (req, res) => {
  // Handle fetching all users logic here
  res.json({ message: 'Get all users route' })
})

userRouter.get('/:id', (req, res) => {
  // Handle fetching a specific user by ID logic here
  const { id } = req.params
  res.json({ message: `Get user with ID ${id} route` })
})

userRouter.post('/', (req, res) => {
  // Handle creating a new user logic here
  res.json({ message: 'Create new user route' })
})

userRouter.patch('/:id', (req, res) => {
  // Handle updating a specific user by ID logic here
  const { id } = req.params
  res.json({ message: `Update user with ID ${id} route` })
})

userRouter.delete('/:id', (req, res) => {
  // Handle deleting a specific user by ID logic here
  const { id } = req.params
  res.json({ message: `Delete user with ID ${id} route` })
})

export default userRouter