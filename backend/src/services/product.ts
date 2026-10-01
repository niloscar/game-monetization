import pool from '../database'
import type { Product, CreateProductBody, UpdateProductBody } from '../types/product'

const productSelect = `
    SELECT
        p.id,
        p.name,
        p.description,
        p.is_available_for_purchase AS "isPurchasable",
        p.is_most_popular AS "isMostPopular",

        (
            SELECT pr.price::float8
            FROM prices pr
            WHERE pr.product_id = p.id
            ORDER BY pr.set_at DESC, pr.id DESC
            LIMIT 1
        ) AS price,

        CASE
            WHEN t.id IS NULL THEN NULL
            ELSE jsonb_build_object(
                'id', t.id,
                'level', t.level
            )
        END AS tier,

        COALESCE(
            (
                SELECT jsonb_agg(
                    jsonb_build_object(
                        'id', f.id,
                        'key', f.key,
                        'name', f.name,
                        'description', f.description
                    )
                    ORDER BY f.id
                )
                FROM product_features pf
                JOIN features f
                    ON f.id = pf.feature_id
                WHERE
                    pf.product_id = p.id
                    AND f.deleted_at IS NULL
            ),
            '[]'::jsonb
        ) AS features,

        COALESCE(
            (
                SELECT jsonb_agg(
                    jsonb_build_object(
                        'id', pu.id,
                        'key', pu.key,
                        'name', pu.name,
                        'description', pu.description,
                        'imageUrl', pu.image_url,
                        'isActive', pu.is_active,
                        'width', pu.width,
                        'height', pu.height,
                        'healthDelta', pu.health_delta,
                        'scoreDelta', pu.score_delta,
                        'speedMultiplier', pu.speed_multiplier,
                        'scoreMultiplier', pu.score_multiplier,
                        'durationSeconds', pu.duration_seconds,
                        'spawnWeight', pu.spawn_weight
                    )
                    ORDER BY pu.id
                )
                FROM product_power_ups ppu
                JOIN power_ups pu
                    ON pu.id = ppu.power_up_id
                WHERE
                    ppu.product_id = p.id
                    AND pu.deleted_at IS NULL
            ),
            '[]'::jsonb
        ) AS "powerUps"

    FROM products p

    LEFT JOIN tiers t
        ON t.product_id = p.id
`

export async function getProducts(): Promise<Product[]> {
    const { rows } = await pool.query<Product>(
        `${productSelect}
        WHERE p.deleted_at IS NULL
        ORDER BY p.id`
    )

    return rows
}

export async function getProduct(id: number): Promise<Product | null> {
    const { rows } = await pool.query<Product>(
        `${productSelect}
        WHERE
            p.id = $1
            AND p.deleted_at IS NULL`,
        [id]
    )

    return rows[0] ?? null
}

export async function createProduct({ name, description, price, isPurchasable = true, tierLevel, featureIds = [], powerUpIds = [] }: CreateProductBody): Promise<Product> {
    const client = await pool.connect()

    try {
        await client.query('BEGIN')

        const { rows } = await client.query<{ id: number }>(
            `INSERT INTO products (
                name,
                description,
                is_available_for_purchase
            )
            VALUES ($1, $2, $3)
            RETURNING id`,
            [name, description, isPurchasable]
        )

        const createdProduct = rows[0]

        if (!createdProduct) {
            throw new Error('Failed to create product')
        }

        const productId = createdProduct.id

        await client.query(
            `INSERT INTO prices (
                product_id,
                price
            )
            VALUES ($1, $2)`,
            [productId, price]
        )

        if (tierLevel !== undefined && tierLevel !== null) {
            await client.query(
                `INSERT INTO tiers (
                    product_id,
                    level
                )
                VALUES ($1, $2)`,
                [productId, tierLevel]
            )
        }

        if (featureIds.length > 0) {
            await client.query(
                `INSERT INTO product_features (
                    product_id,
                    feature_id
                )
                SELECT $1, unnest($2::bigint[])`,
                [productId, featureIds]
            )
        }

        if (powerUpIds.length > 0) {
            await client.query(
                `INSERT INTO product_power_ups (
                    product_id,
                    power_up_id
                )
                SELECT $1, unnest($2::bigint[])`,
                [productId, powerUpIds]
            )
        }

        await client.query('COMMIT')

        const product = await getProduct(productId)

        if (!product) {
            throw new Error('Created product could not be retrieved')
        }

        return product
    } catch (error) {
        await client.query('ROLLBACK')
        throw error
    } finally {
        client.release()
    }
}

export async function updateProduct(
    id: number,
    body: UpdateProductBody
): Promise<Product | null> {
    const client = await pool.connect()

    try {
        await client.query('BEGIN')

        const existing = await client.query(
            `SELECT id
            FROM products
            WHERE id = $1
                AND deleted_at IS NULL
            FOR UPDATE`,
            [id]
        )

        if (existing.rowCount === 0) {
            await client.query('ROLLBACK')
            return null
        }

        const updates: string[] = []
        const values: unknown[] = []
        let parameter = 1

        if (body.name !== undefined) {
            updates.push(`name = $${parameter++}`)
            values.push(body.name)
        }

        if (body.description !== undefined) {
            updates.push(`description = $${parameter++}`)
            values.push(body.description)
        }

        if (body.isPurchasable !== undefined) {
            updates.push(
                `is_available_for_purchase = $${parameter++}`
            )
            values.push(body.isPurchasable)
        }

        if (updates.length > 0) {
            values.push(id)

            await client.query(
                `UPDATE products
                SET ${updates.join(', ')}
                WHERE id = $${parameter}`,
                values
            )
        }

        if (body.price !== undefined) {
            await client.query(
                `INSERT INTO prices (
                    product_id,
                    price
                )
                VALUES ($1, $2)`,
                [id, body.price]
            )
        }

        /*
         * undefined = ändra inte tier
         * null      = ta bort tier
         * number    = skapa/uppdatera tier
         */
        if (body.tierLevel !== undefined) {
            if (body.tierLevel === null) {
                await client.query(
                    `DELETE FROM tiers
                    WHERE product_id = $1`,
                    [id]
                )
            } else {
                await client.query(
                    `INSERT INTO tiers (
                        product_id,
                        level
                    )
                    VALUES ($1, $2)
                    ON CONFLICT (product_id)
                    DO UPDATE SET
                        level = EXCLUDED.level`,
                    [id, body.tierLevel]
                )
            }
        }

        /*
         * Om featureIds skickas ersätter den produktens befintliga features.
         */
        if (body.featureIds !== undefined) {
            await client.query(
                `DELETE FROM product_features
                WHERE product_id = $1`,
                [id]
            )

            if (body.featureIds.length > 0) {
                await client.query(
                    `INSERT INTO product_features (
                        product_id,
                        feature_id
                    )
                    SELECT $1, unnest($2::bigint[])`,
                    [id, body.featureIds]
                )
            }
        }

        /*
         * Om powerUpIds skickas ersätter den produktens befintliga power-ups.
         */
        if (body.powerUpIds !== undefined) {
            await client.query(
                `DELETE FROM product_power_ups
                WHERE product_id = $1`,
                [id]
            )

            if (body.powerUpIds.length > 0) {
                await client.query(
                    `INSERT INTO product_power_ups (
                        product_id,
                        power_up_id
                    )
                    SELECT $1, unnest($2::bigint[])`,
                    [id, body.powerUpIds]
                )
            }
        }

        await client.query('COMMIT')

        return getProduct(id)
    } catch (error) {
        await client.query('ROLLBACK')
        throw error
    } finally {
        client.release()
    }
}

export async function deleteProduct(
    id: number
): Promise<Product | null> {
    const product = await getProduct(id)

    if (!product) {
        return null
    }

    await pool.query(
        `UPDATE products
        SET deleted_at = NOW()
        WHERE id = $1
            AND deleted_at IS NULL`,
        [id]
    )

    return product
}