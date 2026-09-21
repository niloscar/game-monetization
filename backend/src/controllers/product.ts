/**
 * Product controller
 */

import type { Request, Response } from 'express'

export const getProducts = (_req: Request, res: Response<{ message: string }>) => {
    res.json({ message: 'Products-route' })
}

export const getProduct = (req: Request<{ productId: string }>, res: Response<{ message: string }>) => {
    const { productId } = req.params
    res.json({ message: `Product-route for productId: ${productId}` })
}

export const createProduct = (req: Request, res: Response<{ message: string }>) => {
    res.json({ message: 'Create-product route' })
}

export const updateProduct = (req: Request<{ productId: string }>, res: Response<{ message: string }>) => {
    const { productId } = req.params
    res.json({ message: `Update-product route for productId: ${productId}` })
}

export const deleteProduct = (req: Request<{ productId: string }>, res: Response<{ message: string }>) => {
    const { productId } = req.params
    res.json({ message: `Delete-product route for productId: ${productId}` })
}