import pool from '../database'
import type { Score, CreateScoreBody } from '../types/game'

export async function getScores(): Promise<Score[]> {
    const { rows } = await pool.query(
        `SELECT
            s.id,
            s.user_id as "userId",
            u.username,
            s.product_id as "productId",
            s.score,
            s.created_at as "createdAt"
        FROM scores s
        JOIN users u ON s.user_id = u.id
        WHERE s.deleted_at IS NULL`
    )

    return rows
}

export async function getScore(id: number): Promise<Score | null> {
    const { rows } = await pool.query(
        `SELECT
            s.id,
            s.user_id AS "userId",
            u.username,
            s.product_id AS "productId",
            s.score,
            s.created_at AS "createdAt"
        FROM scores s
        JOIN users u ON s.user_id = u.id
        WHERE s.deleted_at IS NULL AND s.id = $1`,
        [id]
    )

    return rows[0] ?? null
}

export async function getScoresByUserId(userId: number): Promise<Score[]> {
    const { rows } = await pool.query(
        `SELECT
            s.id,
            s.user_id AS "userId",
            u.username,
            s.product_id AS "productId",
            s.score,
            s.created_at AS "createdAt"
        FROM scores s
        JOIN users u ON s.user_id = u.id
        WHERE s.deleted_at IS NULL AND s.user_id = $1`,
        [userId]
    )

    return rows
}

export async function createScore(userId: number, score: number): Promise<Score | null> {
    const { rows } = await pool.query<Score>(
        `INSERT INTO scores (
            user_id,
            product_id,
            tier_level_snapshot,
            score
        )
        SELECT
            $1,
            up.product_id,
            t.level,
            $2
        FROM user_products up
        JOIN tiers t
            ON t.product_id = up.product_id
        WHERE up.user_id = $1
        ORDER BY t.level DESC
        LIMIT 1
        RETURNING
            id,
            user_id AS "userId",
            product_id AS "productId",
            tier_level_snapshot AS "tierLevelSnapshot",
            score,
            created_at AS "createdAt"`,
        [userId, score]
    )

    return rows[0] ?? null
}

export async function deleteScore(id: number): Promise<Score | null> {
    const { rows } = await pool.query(
        `UPDATE scores
        SET deleted_at = NOW()
        WHERE id = $1 AND deleted_at IS NULL
        RETURNING 
            id, 
            user_id AS "userId",
            product_id AS "productId", 
            score, 
            created_at AS "createdAt"`,
        [id]
    )

    return rows[0] ?? null
}