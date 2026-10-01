/**
 * Product controller
 */

import * as service from '../services/product'
import { validateId } from '../utils/validation'
import type { Request, Response } from 'express'
import type { Product } from '../types/product'
import type { ApiError } from '../types/errors'

export const getProducts = async (_req: Request, res: Response<Product[]>) => {
    const products = await service.getProducts()

    res.status(200).json(products)
}

export const getProduct = async (req: Request<{ id: string }>, res: Response<Product | ApiError>) => {
    const productId = Number(req.params.id)

    const error = validateId('productId', productId)
    if (error) {
        res.status(400).json(error)
        return
    }

    const product = await service.getProduct(productId)

    if (!product) {
        res.status(404).json({ message: 'Produkten hittades inte.' })
        return
    }

    res.status(200).json(product)
}

export const createProduct = (req: Request, res: Response<ApiError>) => {
    // ONTODO: Implement createProduct logic
    res.json({ message: 'Create-product route' })
}

export const updateProduct = (req: Request<{ id: string }>, res: Response<ApiError>) => {
    const { id } = req.params
    // ONTODO: Implement updateProduct logic
    res.json({ message: `Update-product route for productId: ${id}` })
}

export const deleteProduct = (req: Request<{ id: string }>, res: Response<ApiError>) => {
    const { id } = req.params
    // ONTODO: Implement deleteProduct logic
    res.json({ message: `Delete-product route for productId: ${id}` })
}