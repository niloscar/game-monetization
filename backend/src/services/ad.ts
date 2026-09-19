/**
 * Ad service
 */

import { pool } from "../database"
import type { Ad } from "../types/ad"

export async function getAds(): Promise<Ad[]> {
    const result = await pool.query<Ad>(`SELECT * FROM ads WHERE is_active = true`) // ONTODO: Only select specific columns

    return result.rows
}

export async function getAd(id: number): Promise<Ad | null> {
    const result = await pool.query<Ad>(
        `SELECT * FROM ads WHERE id = $1 AND is_active = true`, // ONTODO: Only select specific columns
        [id]
    )

    return result.rows[0] ?? null
}