/**
 * Ad service
 */

import pool from '../database'
import type { Ad, CreateAdBody, UpdateAdBody, AdPlacement } from '../types/ad'

export async function getAds(placement?: AdPlacement, activeOnly = true): Promise<Ad[]> {
    const { rows } = await pool.query<Ad>(
        `SELECT
            id,
            media_type,
            media_url,
            target_url,
            duration_seconds,
            placement,
            is_active,
            title,
            weight
        FROM ads
        WHERE deleted_at IS NULL
            AND ($1::text IS NULL OR placement = $1)
            AND ($2::boolean = FALSE OR is_active = TRUE)
        ORDER BY id`,
        [placement ?? null, activeOnly]
    )

    return rows
}

export async function getAd(id: number, activeOnly = true): Promise<Ad | null> {
    const { rows } = await pool.query<Ad>(
        `SELECT
            id,
            media_type,
            media_url,
            target_url,
            duration_seconds,
            placement,
            is_active,
            title,
            weight
        FROM ads
        WHERE id = $1
            AND deleted_at IS NULL
            AND ($2::boolean = FALSE OR is_active = TRUE)`,
        [id, activeOnly]
    )

    return rows[0] ?? null
}

export async function createAd({
    media_type,
    media_url,
    target_url = null,
    duration_seconds = null,
    placement,
    is_active = true,
    title = null,
    weight = null
}: CreateAdBody): Promise<Ad> {
    const { rows } = await pool.query<Ad>(
        `INSERT INTO ads (
            media_type,
            media_url,
            target_url,
            duration_seconds,
            placement,
            is_active,
            title,
            weight
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING
            id,
            media_type,
            media_url,
            target_url,
            duration_seconds,
            placement,
            is_active,
            title,
            weight`,
        [media_type, media_url, target_url, duration_seconds, placement, is_active, title, weight]
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

    if (body.media_type !== undefined) {
        updates.push(`media_type = $${parameter++}`)
        values.push(body.media_type)
    }

    if (body.media_url !== undefined) {
        updates.push(`media_url = $${parameter++}`)
        values.push(body.media_url)
    }

    if (body.target_url !== undefined) {
        updates.push(`target_url = $${parameter++}`)
        values.push(body.target_url)
    }

    if (body.duration_seconds !== undefined) {
        updates.push(`duration_seconds = $${parameter++}`)
        values.push(body.duration_seconds)
    }

    if (body.placement !== undefined) {
        updates.push(`placement = $${parameter++}`)
        values.push(body.placement)
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
            media_type,
            media_url,
            target_url,
            duration_seconds,
            placement,
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
            media_type,
            media_url,
            target_url,
            duration_seconds,
            placement,
            is_active,
            title,
            weight`,
        [id]
    )

    return rows[0] ?? null
}