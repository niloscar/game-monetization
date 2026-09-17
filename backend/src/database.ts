import dotenv from 'dotenv'
import { Pool } from 'pg'
import { type DbClient } from './types/database'

dotenv.config()

export const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: false
    }
})

export async function connect() {
    const client = await pool.connect()
    console.log('Connected to the database')
    client.release()
}

export default pool
