/**
 * Test routes
 */

import { Router } from 'express'
import { hashPassword } from '../utils/password'

const testRouter = Router()

testRouter.post('/hash', async (req, res) => {
    const { password } = req.body
    const hashedPassword = await hashPassword(password)

    res.json({ hashedPassword })
})

testRouter.get('/', (_req, res) => {
    res.json({ message: 'Backend fungerar!' })
})

export default testRouter