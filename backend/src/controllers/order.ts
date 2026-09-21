/**
 * Order controller
 */

import type { Request, Response } from 'express'


/*------------------------------------------------------------------------------
 * Orders
 *------------------------------------------------------------------------------*/
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


/*------------------------------------------------------------------------------
 * Tiers
 *------------------------------------------------------------------------------*/
export const getTiers = (_req: Request, res: Response<{ message: string }>) => {
    res.json({ message: 'GET Tiers-route' })
}

/*------------------------------------------------------------------------------
 * Reciepts
 *------------------------------------------------------------------------------*/
export const getRecieptsByUserId = (req: Request<{ userId: string }>, res: Response<{ message: string }>) => {
    const { userId } = req.params
    res.json({ message: `Reciepts-by-userId route for userId: ${userId}` })
}

export const getReciept = (req: Request<{ recieptId: string }>, res: Response<{ message: string }>) => {
    const { recieptId } = req.params
    res.json({ message: `Reciept-route for recieptId: ${recieptId}` })
}