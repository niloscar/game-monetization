import pool from '../database'

export async function getUsers() {
    const { rows } = await pool.query(
        `SELECT id, username, email
      FROM users
      WHERE deleted_at IS NULL`
    )

    if (rows.length === 0) throw new Error('Inga användare kunde hittas.')

    return rows
}
