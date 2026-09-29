/**
 * Order controller
 */

import * as service from '../services/order'
import { OrderServiceError } from '../services/order'
import { validateField, validateId } from '../utils/validation'
import type { Request, Response } from 'express'
import type { Order, CreateOrderBody, UpdateOrderBody } from '../types/order'
import type { ApiError } from '../types/errors'

export const getOrders = async (_req: Request, res: Response<Order[]>) => {
    const orders = await service.getOrders()

    res.status(200).json(orders)
}

export const getOrder = async (req: Request<{ orderId: string }>, res: Response<Order | ApiError>) => {
    const orderId = Number(req.params.orderId)

    const error = validateId('orderId', orderId)
    if (error) {
        res.status(400).json(error)
        return
    }

    const order = await service.getOrder(orderId)

    if (!order) {
        res.status(404).json({ message: 'Ordern hittades inte.' })
        return
    }

    res.status(200).json(order)
}

export const getCurrentUserOrders = async (req: Request, res: Response<Order[]>) => {
    const userId = req.session.userId!

    const orders = await service.getOrdersByUser(userId)

    res.status(200).json(orders)
}

export const getCurrentUserOrder = async (req: Request<{ id: string }>, res: Response<Order | ApiError>) => {
    const userId = req.session.userId!
    const orderId = Number(req.params.id)

    const error = validateId('id', orderId)
    if (error) {
        res.status(400).json(error)
        return
    }

    const order = await service.getOrderByUser(orderId, userId)

    if (!order) {
        res.status(404).json({ message: 'Ordern hittades inte.', field: 'id' })
        return
    }

    res.status(200).json(order)
}

export const createOrder = async (req: Request<{}, {}, CreateOrderBody>, res: Response<Order | ApiError>) => {
    const userId = req.session.userId!

    const { paymentMethodId, address, items } = req.body

    if (paymentMethodId !== undefined && paymentMethodId !== null) {
        const error = validateId('paymentMethodId', paymentMethodId)

        if (error) {
            res.status(400).json(error)
            return
        }
    }

    if (!address) {
        res.status(400).json({ message: 'Adress måste anges.', field: 'address' })
        return
    }

    const addressFields = [
        'fname',
        'lname',
        'street',
        'zipcode',
        'city',
        'country'
    ] as const

    for (const field of addressFields) {
        const error = validateField(`address.${field}`, address[field], 'string')

        if (error) {
            res.status(400).json(error)
            return
        }
    }

    if (!Array.isArray(items) || items.length === 0) {
        res.status(400).json({ message: 'Ordern måste innehålla minst en produkt.', field: 'items' })
        return
    }

    for (const [i, item] of items.entries()) {
        const productIdError = validateId(`items.${i}.productId`, item.productId)

        if (productIdError) {
            res.status(400).json(productIdError)
            return
        }

        const quantityError = validateField(`items.${i}.quantity`, item.quantity, 'number')

        if (quantityError) {
            res.status(400).json(quantityError)
            return
        }

        if (!Number.isInteger(item.quantity) || item.quantity < 1) {
            res.status(400).json({ message: 'Antal måste vara ett positivt heltal.', field: `items.${i}.quantity` })
            return
        }
    }

    const productIds = items.map(item => item.productId) // Check for duplicate product IDs in the order

    if (new Set(productIds).size !== productIds.length) {
        res.status(400).json({ message: 'Samma produkt får inte förekomma flera gånger i ordern.', field: 'items' })
        return
    }

    try {
        const order = await service.createOrder(userId, req.body)

        res.status(201).json(order)
    } catch (error) {
        if (error instanceof OrderServiceError) {
            if (error.code === 'PAYMENT_METHOD_NOT_AVAILABLE') {
                res.status(400).json({ message: 'Betalningsmetoden är inte tillgänglig.', field: 'paymentMethodId' })
                return
            }

            if (error.code === 'PRODUCT_NOT_AVAILABLE') {
                res.status(409).json({ message: `Produkt ${error.productId} är inte tillgänglig för köp.`, field: 'items' })
                return
            }
        }

        throw error
    }
}

export const updateOrder = async (req: Request<{ orderId: string }, {}, UpdateOrderBody>, res: Response<Order | ApiError>) => {
    const orderId = Number(req.params.orderId)

    const idError = validateId('orderId', orderId)
    if (idError) {
        res.status(400).json(idError)
        return
    }

    const { paymentMethodId, status } = req.body

    if (paymentMethodId !== undefined && paymentMethodId !== null) {
        const error = validateId('paymentMethodId', paymentMethodId)

        if (error) {
            res.status(400).json(error)
            return
        }
    }

    if (status !== undefined) {
        const error = validateField('status', status, 'string')

        if (error) {
            res.status(400).json(error)
            return
        }
    }

    if (paymentMethodId === undefined && status === undefined) {
        res.status(400).json({ message: 'Inga fält att uppdatera.' })
        return
    }

    try {
        const order = await service.updateOrder(orderId, req.body)

        if (!order) {
            res.status(404).json({ message: 'Ordern hittades inte.' })
            return
        }

        res.status(200).json(order)
    } catch (error) {
        if (error instanceof OrderServiceError && error.code === 'PAYMENT_METHOD_NOT_AVAILABLE') {
            res.status(400).json({ message: 'Betalningsmetoden är inte tillgänglig.', field: 'paymentMethodId' })
            return
        }

        throw error
    }
}

export const deleteOrder = async (req: Request<{ orderId: string }>, res: Response<Order | ApiError>) => {
    const orderId = Number(req.params.orderId)

    const error = validateId('orderId', orderId)
    if (error) {
        res.status(400).json(error)
        return
    }

    const order = await service.deleteOrder(orderId)

    if (!order) {
        res.status(404).json({ message: 'Ordern hittades inte.' })
        return
    }

    res.status(200).json(order)
}