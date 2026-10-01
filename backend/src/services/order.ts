import pool from '../database'
import type { Order, UpdateOrderBody } from '../types/order'
import type { CreateOrderBody, CreateOrderResponse } from '@assignment/shared/types/order'

export type OrderServiceErrorCode =
    | 'PAYMENT_METHOD_NOT_AVAILABLE'
    | 'PRODUCT_NOT_AVAILABLE'

export class OrderServiceError extends Error {
    constructor(public code: OrderServiceErrorCode, public productId?: number) {
        super(code)
    }
}

const orderSelect = `
    SELECT
        o.id,
        o.customer_id AS "customerId",
        o.payment_method_id AS "paymentMethodId",
        o.status,
        o.ordered_at AS "orderedAt",
        o.paid_at AS "paidAt",

        jsonb_build_object(
            'id', oa.id,
            'fname', oa.fname,
            'lname', oa.lname,
            'street', oa.street,
            'zipcode', oa.zipcode,
            'city', oa.city,
            'country', oa.country
        ) AS address,

        COALESCE(
            (
                SELECT jsonb_agg(
                    jsonb_build_object(
                        'productId', oi.product_id,
                        'quantity', oi.quantity,
                        'unitPrice', oi.unit_price::float8
                    )
                    ORDER BY oi.product_id
                )
                FROM order_items oi
                WHERE oi.order_id = o.id
            ),
            '[]'::jsonb
        ) AS items

    FROM orders o

    JOIN order_addresses oa
        ON oa.order_id = o.id
`

export async function getOrders(): Promise<Order[]> {
    const { rows } = await pool.query<Order>(
        `${orderSelect}
        WHERE o.deleted_at IS NULL
        ORDER BY o.ordered_at DESC`
    )

    return rows
}

export async function getOrder(
    id: number
): Promise<Order | null> {
    const { rows } = await pool.query<Order>(
        `${orderSelect}
        WHERE
            o.id = $1
            AND o.deleted_at IS NULL`,
        [id]
    )

    return rows[0] ?? null
}

export async function getOrdersByUser(userId: number): Promise<Order[]> {
    const { rows } = await pool.query<Order>(
        `${orderSelect}
        JOIN customers c
            ON c.id = o.customer_id
        WHERE
            c.user_id = $1
            AND o.deleted_at IS NULL
        ORDER BY o.ordered_at DESC`,
        [userId]
    )

    return rows
}

export async function getOrderByUser(id: number, userId: number): Promise<Order | null> {
    const { rows } = await pool.query<Order>(
        `${orderSelect}
        JOIN customers c
            ON c.id = o.customer_id
        WHERE
            o.id = $1
            AND c.user_id = $2
            AND o.deleted_at IS NULL`,
        [id, userId]
    )

    return rows[0] ?? null
}

export async function createOrder(
    userId: number,
    { productId, paymentMethod }: CreateOrderBody
): Promise<CreateOrderResponse> {
    const client = await pool.connect()

    try {
        await client.query('BEGIN')

        /*
        * Create or reuse the customer connected to the authenticated user.
        */
        const customerResult = await client.query<{ id: number }>(
            `INSERT INTO customers (
                user_id
            )
            VALUES ($1)

            ON CONFLICT (user_id)
            DO UPDATE SET
                user_id = EXCLUDED.user_id

            RETURNING id`,
            [userId]
        )

        const customer = customerResult.rows[0]

        if (!customer) {
            throw new Error('Failed to create customer')
        }

        /*
         * Check that the selected payment method exists and is active.
         */
        const paymentMethodResult = await client.query<{ id: number }>(
            `SELECT id
            FROM payment_methods
            WHERE
                key = $1
                AND is_active = TRUE`,
            [paymentMethod]
        )

        const selectedPaymentMethod = paymentMethodResult.rows[0]

        if (!selectedPaymentMethod) {
            throw new OrderServiceError('PAYMENT_METHOD_NOT_AVAILABLE')
        }

        /*
         * Check that the product exists and is available for purchase.
         * The latest price is fetched from prices and later stored as a snapshot
         * on the order item.
         */
        const productResult = await client.query<{
            id: number
            price: string
        }>(
            `SELECT
                p.id,
                pr.price
            FROM products p

            JOIN LATERAL (
                SELECT price
                FROM prices
                WHERE product_id = p.id
                ORDER BY
                    set_at DESC,
                    id DESC
                LIMIT 1
            ) pr ON TRUE

            WHERE
                p.id = $1
                AND p.deleted_at IS NULL
                AND p.is_available_for_purchase = TRUE`,
            [productId]
        )

        const product = productResult.rows[0]

        if (!product) {
            throw new OrderServiceError(
                'PRODUCT_NOT_AVAILABLE',
                productId
            )
        }

        /*
         * Create the order.
         */
        const orderResult = await client.query<{ id: number }>(
            `INSERT INTO orders (
                customer_id,
                payment_method_id,
                status,
                paid_at
            )
            VALUES ($1, $2, 'paid', NOW())
            RETURNING id`,
            [
                customer.id,
                selectedPaymentMethod.id
            ]
        )

        const createdOrder = orderResult.rows[0]

        if (!createdOrder) {
            throw new Error('Failed to create order')
        }

        const orderId = createdOrder.id

        /*
         * Save customer information as an order snapshot.
         * Remaining fields are nullable for now.
         */
        await client.query(
            `INSERT INTO order_addresses (
                order_id
            )
            VALUES ($1)`,
            [orderId]
        )

        /*
         * Add the selected product to the order.
         * Store the current price as a snapshot.
         */
        await client.query(
            `INSERT INTO order_items (
                order_id,
                product_id,
                quantity,
                unit_price
            )
            VALUES ($1, $2, $3, $4)`,
            [
                orderId,
                product.id,
                1,
                product.price
            ]
        )

        await client.query('COMMIT')

        return { id: Number(orderId) }
    } catch (error) {
        await client.query('ROLLBACK')
        throw error
    } finally {
        client.release()
    }
}

export async function updateOrder(id: number, body: UpdateOrderBody): Promise<Order | null> {
    const updates: string[] = []
    const values: unknown[] = []

    let parameter = 1

    if (body.paymentMethodId !== undefined) {
        if (body.paymentMethodId !== null) {
            const { rowCount } = await pool.query(
                `SELECT id
                FROM payment_methods
                WHERE
                    id = $1
                    AND is_active = TRUE`,
                [body.paymentMethodId]
            )

            if (rowCount === 0) throw new OrderServiceError('PAYMENT_METHOD_NOT_AVAILABLE')
        }

        updates.push(`payment_method_id = $${parameter++}`)
        values.push(body.paymentMethodId)
    }

    if (body.status !== undefined) {
        updates.push(`status = $${parameter++}`)
        values.push(body.status)
    }

    if (updates.length === 0) return getOrder(id)

    values.push(id)

    const { rows } = await pool.query<{ id: number }>(
        `UPDATE orders
        SET ${updates.join(', ')}
        WHERE
            id = $${parameter}
            AND deleted_at IS NULL
        RETURNING id`,
        values
    )

    if (!rows[0]) return null

    return getOrder(id)
}

export async function deleteOrder(id: number): Promise<Order | null> {
    const order = await getOrder(id)

    if (!order) return null

    await pool.query(
        `UPDATE orders
        SET deleted_at = NOW()
        WHERE
            id = $1
            AND deleted_at IS NULL`,
        [id]
    )

    return order
}