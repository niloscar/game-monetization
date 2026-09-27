import { pool } from '../database'
import type { AuthCredentials } from '../types/auth'

export async function getAuthCredentialsByEmail(
    email: string
): Promise<AuthCredentials | null> {
    const { rows } = await pool.query<AuthCredentials>(
        `SELECT
            id::int AS id,
            password_hash AS "passwordHash"
        FROM users
        WHERE email = $1 AND deleted_at IS NULL`,
        [email]
    )

    return rows[0] ?? null
}

export async function getAuthRole(id: number): Promise<string | null> {
    const { rows } = await pool.query<{ name: string }>(
        `SELECT r.name
        FROM users u
        JOIN roles r ON r.id = u.role_id
        WHERE u.id = $1
        AND u.deleted_at IS NULL`,
        [id]
    )

    return rows[0]?.name ?? null
}
