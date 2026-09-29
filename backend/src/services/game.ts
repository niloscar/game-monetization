import pool from '../database'
import type { CreateScoreData, ScoreboardEntry, ScoreboardPeriod, Score } from '../types/game'

export async function getScores(): Promise<Score[]> {
    const { rows } = await pool.query(
        `SELECT
            s.id::int AS id,
            s.user_id::int AS "userId",
            u.username,
            s.product_id::int AS "productId",
            s.tier_level_snapshot AS "tierLevelSnapshot",
            s.score::int AS score,
            s.created_at AS "createdAt"
        FROM scores s
        JOIN users u ON s.user_id = u.id
        WHERE s.deleted_at IS NULL
        ORDER BY s.created_at DESC`
    )

    return rows
}

export async function getScore(id: number): Promise<Score | null> {
    const { rows } = await pool.query(
        `SELECT
            s.id::int AS id,
            s.user_id::int AS "userId",
            u.username,
            s.product_id::int AS "productId",
            s.tier_level_snapshot AS "tierLevelSnapshot",
            s.score::int AS score,
            s.created_at AS "createdAt"
        FROM scores s
        JOIN users u ON s.user_id = u.id
        WHERE s.id = $1 AND s.deleted_at IS NULL`,
        [id]
    )

    return rows[0] ?? null
}

export async function getScoresByUserId(userId: number): Promise<Score[]> {
    const { rows } = await pool.query(
        `SELECT
            s.id::int AS id,
            s.user_id::int AS "userId",
            u.username,
            s.product_id::int AS "productId",
            s.tier_level_snapshot AS "tierLevelSnapshot",
            s.score::int AS score,
            s.created_at AS "createdAt"
        FROM scores s
        JOIN users u ON s.user_id = u.id
        WHERE s.user_id = $1 AND s.deleted_at IS NULL
        ORDER BY s.created_at DESC`,
        [userId]
    )

    return rows
}

export async function createScore({ userId, score }: CreateScoreData): Promise<Score | null> {
    const { rows } = await pool.query(
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
        JOIN tiers t ON t.product_id = up.product_id
        WHERE up.user_id = $1
        ORDER BY t.level DESC
        LIMIT 1
        RETURNING
            id::int AS id,
            user_id::int AS "userId",
            product_id::int AS "productId",
            tier_level_snapshot AS "tierLevelSnapshot",
            score::int AS score,
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
            id::int AS id,
            user_id::int AS "userId",
            product_id::int AS "productId",
            tier_level_snapshot AS "tierLevelSnapshot",
            score::int AS score,
            created_at AS "createdAt"`,
        [id]
    )

    return rows[0] ?? null
}

// Bara 'today'/'week' behöver ett intervall — 'all' filtrerar inget.
const PERIOD_INTERVAL: Record<Exclude<ScoreboardPeriod, 'all'>, string> = {
    today: '1 day',
    week: '7 days'
}

export async function getScoreboard(period: ScoreboardPeriod): Promise<ScoreboardEntry[]> {
    const interval = period === 'all' ? null : PERIOD_INTERVAL[period]

    const { rows } = await pool.query(
        `WITH best_scores AS (
            SELECT DISTINCT ON (s.user_id)
                s.user_id,
                s.score
            FROM scores s
            WHERE s.deleted_at IS NULL
                AND ($1::text IS NULL OR s.created_at >= NOW() - $1::interval)
            ORDER BY s.user_id, s.score DESC, s.created_at ASC
        )
        SELECT
            RANK() OVER (ORDER BY b.score DESC)::int AS rank,
            b.user_id::int AS "userId",
            u.username,
            b.score::int AS score
        FROM best_scores b
        JOIN users u ON u.id = b.user_id AND u.deleted_at IS NULL
        ORDER BY rank ASC`,
        [interval]
    )

    return rows
}