import pool from '../database'
import type {
    CreatePowerUpBody,
    PowerUp,
    UpdatePowerUpBody
} from '../types/powerUp'

interface PowerUpRow {
    id: string
    name: string
    key: string
    description: string | null
    imageUrl: string | null
    isActive: boolean
    width: number
    height: number
    healthDelta: number
    scoreDelta: string
    speedMultiplier: string
    scoreMultiplier: string
    durationSeconds: number
    spawnWeight: number
}

const powerUpFields = `
    id,
    name,
    key,
    description,
    image_url AS "imageUrl",
    is_active AS "isActive",
    width,
    height,
    health_delta AS "healthDelta",
    score_delta AS "scoreDelta",
    speed_multiplier AS "speedMultiplier",
    score_multiplier AS "scoreMultiplier",
    duration_seconds AS "durationSeconds",
    spawn_weight AS "spawnWeight"
`

function mapPowerUp(row: PowerUpRow): PowerUp {
    return {
        ...row,
        id: Number(row.id),
        scoreDelta: Number(row.scoreDelta),
        speedMultiplier: Number(row.speedMultiplier),
        scoreMultiplier: Number(row.scoreMultiplier)
    }
}

export async function getPowerUps(): Promise<PowerUp[]> {
    const { rows } = await pool.query<PowerUpRow>(
        `SELECT
            ${powerUpFields}
        FROM power_ups
        WHERE deleted_at IS NULL
        ORDER BY id`
    )

    return rows.map(mapPowerUp)
}

export async function getPowerUp(id: number): Promise<PowerUp | null> {
    const { rows } = await pool.query<PowerUpRow>(
        `SELECT
            ${powerUpFields}
        FROM power_ups
        WHERE
            id = $1
            AND deleted_at IS NULL`,
        [id]
    )

    return rows[0] ? mapPowerUp(rows[0]) : null
}

export async function createPowerUp(data: CreatePowerUpBody): Promise<PowerUp> {
    const {
        name,
        key,
        description = null,
        imageUrl = null,
        isActive = true,
        width = 24,
        height = 24,
        healthDelta = 0,
        scoreDelta = 0,
        speedMultiplier = 1,
        scoreMultiplier = 1,
        durationSeconds = 0,
        spawnWeight = 1,
        productIds = []
    } = data

    const { rows } = await pool.query<PowerUpRow>(
        `INSERT INTO power_ups (
            name,
            key,
            description,
            image_url,
            is_active,
            width,
            height,
            health_delta,
            score_delta,
            speed_multiplier,
            score_multiplier,
            duration_seconds,
            spawn_weight
        )
        VALUES (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7,
            $8,
            $9,
            $10,
            $11,
            $12,
            $13
        )
        RETURNING
            ${powerUpFields}`,
        [
            name,
            key,
            description,
            imageUrl,
            isActive,
            width,
            height,
            healthDelta,
            scoreDelta,
            speedMultiplier,
            scoreMultiplier,
            durationSeconds,
            spawnWeight
        ]
    )

    const powerUp = rows[0]

    if (!powerUp) {
        throw new Error('Failed to create power-up')
    }

    for (const productId of productIds) {
        await pool.query(
            `INSERT INTO product_power_ups (product_id, power_up_id)
         VALUES ($1, $2)`,
            [productId, powerUp.id]
        )
    }

    return mapPowerUp(powerUp)
}

export async function updatePowerUp(
    id: number,
    data: UpdatePowerUpBody
): Promise<PowerUp | null> {
    const updates: string[] = []
    const values: unknown[] = []

    let parameter = 1

    if (data.name !== undefined) {
        updates.push(`name = $${parameter++}`)
        values.push(data.name)
    }

    if (data.description !== undefined) {
        updates.push(`description = $${parameter++}`)
        values.push(data.description)
    }

    if (data.imageUrl !== undefined) {
        updates.push(`image_url = $${parameter++}`)
        values.push(data.imageUrl)
    }

    if (data.isActive !== undefined) {
        updates.push(`is_active = $${parameter++}`)
        values.push(data.isActive)
    }

    if (data.width !== undefined) {
        updates.push(`width = $${parameter++}`)
        values.push(data.width)
    }

    if (data.height !== undefined) {
        updates.push(`height = $${parameter++}`)
        values.push(data.height)
    }

    if (data.healthDelta !== undefined) {
        updates.push(`health_delta = $${parameter++}`)
        values.push(data.healthDelta)
    }

    if (data.scoreDelta !== undefined) {
        updates.push(`score_delta = $${parameter++}`)
        values.push(data.scoreDelta)
    }

    if (data.speedMultiplier !== undefined) {
        updates.push(`speed_multiplier = $${parameter++}`)
        values.push(data.speedMultiplier)
    }

    if (data.scoreMultiplier !== undefined) {
        updates.push(`score_multiplier = $${parameter++}`)
        values.push(data.scoreMultiplier)
    }

    if (data.durationSeconds !== undefined) {
        updates.push(`duration_seconds = $${parameter++}`)
        values.push(data.durationSeconds)
    }

    if (data.spawnWeight !== undefined) {
        updates.push(`spawn_weight = $${parameter++}`)
        values.push(data.spawnWeight)
    }

    if (updates.length === 0) return getPowerUp(id)

    values.push(id)

    const { rows } = await pool.query<PowerUpRow>(
        `UPDATE power_ups
        SET ${updates.join(', ')}
        WHERE
            id = $${parameter}
            AND deleted_at IS NULL
        RETURNING
            ${powerUpFields}`,
        values
    )

    return rows[0] ? mapPowerUp(rows[0]) : null
}

export async function deletePowerUp(id: number): Promise<PowerUp | null> {
    const { rows } = await pool.query<PowerUpRow>(
        `UPDATE power_ups
        SET deleted_at = NOW()
        WHERE
            id = $1
            AND deleted_at IS NULL
        RETURNING
            ${powerUpFields}`,
        [id]
    )

    return rows[0] ? mapPowerUp(rows[0]) : null
}
