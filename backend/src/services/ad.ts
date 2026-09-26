/**
 * Ad service
 */

import pool from '../database'
import type { Ad, CreateAdBody, UpdateAdBody } from '../types/ad'

export async function getAds(): Promise<Ad[]> {
    const { rows } = await pool.query<Ad>(
        `SELECT
            id,
            type,
            url,
            is_active,
            title,
            weight
        FROM ads
        WHERE deleted_at IS NULL
        ORDER BY id`
    )

    return rows
}

export async function getAd(id: number): Promise<Ad | null> {
    const { rows } = await pool.query<Ad>(
        `SELECT
            id,
            type,
            url,
            is_active,
            title,
            weight
        FROM ads
        WHERE id = $1 AND deleted_at IS NULL`,
        [id]
    )

    return rows[0] ?? null
}

export async function createAd({ type, url, is_active = true, title = null, weight = null }: CreateAdBody): Promise<Ad> {
    const { rows } = await pool.query<Ad>(
        `INSERT INTO ads (
            type,
            url,
            is_active,
            title,
            weight
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING
            id,
            type,
            url,
            is_active,
            title,
            weight`,
        [type, url, is_active, title, weight]
    )

    const createdAd = rows[0]

    if (!createdAd) {
        throw new Error('Failed to create ad')
    }

    return createdAd
}

export async function updateAd(id: number, body: UpdateAdBody): Promise<Ad | null> {
    const updates: string[] = []
    const values: unknown[] = []
    let parameter = 1

    if (body.type !== undefined) {
        updates.push(`type = $${parameter++}`)
        values.push(body.type)
    }

    if (body.url !== undefined) {
        updates.push(`url = $${parameter++}`)
        values.push(body.url)
    }

    if (body.is_active !== undefined) {
        updates.push(`is_active = $${parameter++}`)
        values.push(body.is_active)
    }

    if (body.title !== undefined) {
        updates.push(`title = $${parameter++}`)
        values.push(body.title)
    }

    if (body.weight !== undefined) {
        updates.push(`weight = $${parameter++}`)
        values.push(body.weight)
    }

    if (updates.length === 0) {
        return getAd(id)
    }

    values.push(id)

    const { rows } = await pool.query<Ad>(
        `UPDATE ads
        SET ${updates.join(', ')}
        WHERE id = $${parameter} AND deleted_at IS NULL
        RETURNING
            id,
            type,
            url,
            is_active,
            title,
            weight`,
        values
    )

    return rows[0] ?? null
}

export async function deleteAd(id: number): Promise<Ad | null> {
    const { rows } = await pool.query<Ad>(
        `UPDATE ads
        SET deleted_at = NOW()
        WHERE id = $1 AND deleted_at IS NULL
        RETURNING
            id,
            type,
            url,
            is_active,
            title,
            weight`,
        [id]
    )

    return rows[0] ?? null
}