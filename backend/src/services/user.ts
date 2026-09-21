import pool from '../database'
import type { User, UpdateUserData, CreateUserData } from '../types/user'

export async function getUsers() {
    const { rows } = await pool.query(
        `SELECT
            u.id,
            u.username,
            u.email,
            json_build_object(
                'id', r.id,
                'name', r.name,
                'description', r.description
            ) AS role,
            tier.tier,
            u.created_at
        FROM users u

        LEFT JOIN roles r ON r.id = u.role_id

        LEFT JOIN LATERAL (
            SELECT
                json_build_object(
                    'id', t.id,
                    'name', p.name,
                    'description', p.description,
                    'level', t.level
                ) AS tier
            FROM user_products up
            JOIN tiers t ON t.product_id = up.product_id
            JOIN products p ON p.id = t.product_id
            WHERE up.user_id = u.id
            ORDER BY t.level DESC
            LIMIT 1
        ) tier ON TRUE

        WHERE u.deleted_at IS NULL`
    )

    return rows
}

export async function getUser(id: number): Promise<User | null> {
    const { rows } = await pool.query(
        `SELECT
            u.id,
            u.username,
            u.email,
            json_build_object(
                'id', r.id,
                'name', r.name,
                'description', r.description
            ) AS role,
            tier.tier,
            u.created_at
        FROM users u

        LEFT JOIN roles r ON r.id = u.role_id

        LEFT JOIN LATERAL (
            SELECT
                json_build_object(
                    'id', t.id,
                    'name', p.name,
                    'description', p.description,
                    'level', t.level
                ) AS tier
            FROM user_products up
            JOIN tiers t ON t.product_id = up.product_id
            JOIN products p ON p.id = t.product_id
            WHERE up.user_id = u.id
            ORDER BY t.level DESC
            LIMIT 1
        ) tier ON TRUE

        WHERE u.deleted_at IS NULL AND u.id = $1`,
        [id]
    )

    return rows[0] ?? null
}

export async function createUser({
    username,
    email,
    passwordHash,
    roleId
}: CreateUserData) {
    const { rows } = await pool.query(
        `INSERT INTO users (username, email, password_hash, role_id)
        VALUES ($1, $2, $3, $4)
        RETURNING id, username, email, role_id, created_at`,
        [username, email, passwordHash, roleId]
    )

    return rows[0]
}

export async function updateUser(
    id: number,
    data: UpdateUserData
): Promise<User | null> {
    const { username, email, passwordHash, roleId } = data

    const { rows } = await pool.query(
        `UPDATE users
        SET
            username = COALESCE($1, username),
            email = COALESCE($2, email),
            password_hash = COALESCE($3, password_hash),
            role_id = COALESCE($4, role_id)
        WHERE id = $5 AND deleted_at IS NULL
        RETURNING id`,
        [username, email, passwordHash, roleId, id]
    )

    if (!rows.length) return null

    return getUser(id)
}

export async function deleteUser(id: number) {
    const { rows } = await pool.query(
        `UPDATE users
        SET deleted_at = NOW()
        WHERE id = $1 AND deleted_at IS NULL
        RETURNING id, username, email, role_id, created_at`,
        [id]
    )

    return rows[0] ?? null
}

export async function getUserPasswordHash(id: number): Promise<string | null> {
    const { rows } = await pool.query<{ passwordHash: string }>(
        `SELECT password_hash AS "passwordHash"
         FROM users
         WHERE id = $1 AND deleted_at IS NULL`,
        [id]
    )

    return rows[0]?.passwordHash ?? null
}

export async function updateUserPassword(id: number, passwordHash: string, previousHash: string): Promise<User | null> {
    const { rows } = await pool.query(
        `UPDATE users
        SET password_hash = $1
        WHERE id = $2
            AND password_hash = $3
            AND deleted_at IS NULL
        RETURNING id`,
        [passwordHash, id, previousHash]
    )

    if (!rows.length) return null

    return getUser(id)
}
