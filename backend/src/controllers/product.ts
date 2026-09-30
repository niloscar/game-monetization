/**
 * Product controller
 */

import * as service from '../services/product'
import type { Request, Response } from 'express'
import type { Product } from '../types/product'

export const getProducts = async (_req: Request, res: Response<Product[]>) => {
    const products = await service.getProducts()

    res.status(200).json(products)
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