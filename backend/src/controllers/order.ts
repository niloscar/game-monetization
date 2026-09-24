/**
 * Order controller
 */

import type { Request, Response } from 'express'

export const getOrders = (_req: Request, res: Response<{ message: string }>) => {
    res.json({ message: 'Orders-route' })
}

export const getOrder = (req: Request<{ orderId: string }>, res: Response<{ message: string }>) => {
    const { orderId } = req.params
    res.json({ message: `Order-route for orderId: ${orderId}` })
}

export const createOrder = (req: Request, res: Response<{ message: string }>) => {
    res.json({ message: 'Create-order route' })
}

export const updateOrder = (req: Request<{ orderId: string }>, res: Response<{ message: string }>) => {
    const { orderId } = req.params
    res.json({ message: `Update-order route for orderId: ${orderId}` })
}

export const deleteOrder = (req: Request<{ orderId: string }>, res: Response<{ message: string }>) => {
    const { orderId } = req.params
    res.json({ message: `Delete-order route for orderId: ${orderId}` })
}