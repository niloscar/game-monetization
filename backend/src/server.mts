import express from 'express'
import expressSession from 'express-session'
import connectPgSimple from 'connect-pg-simple'
import dotenv from 'dotenv'
import { pool } from './database'

import adRouter from './routes/ad'
import authRouter from './routes/auth'
import gameRouter from './routes/game'
import orderRouter from './routes/order'
import powerUpRouter from './routes/powerUp'
import productRouter from './routes/product'
import userRouter from './routes/user'
import adminRouter from './routes/admin'

import { errorHandler } from './middleware/errorHandler'
import { notFoundHandler } from './middleware/notFoundHandler'

dotenv.config()

console.log('Blob token:', process.env.BLOB_READ_WRITE_TOKEN ? 'FOUND' : 'MISSING')

const host = process.env.HOST || 'localhost'
const port = process.env.PORT || 3000

const app = express()

app.use(express.json())

/* Middleware */
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const PgStore = connectPgSimple(expressSession)
app.use(
    expressSession({
        store: new PgStore({
            pool,
            tableName: 'sessions'
        }),
        secret: process.env.SESSION_SECRET || 'mega-secret-key',
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            maxAge: 60 * 60 * 1000
        }
    })
)

/* API routes */
app.use('/api/ad', adRouter)
app.use('/api/auth', authRouter)
app.use('/api/game', gameRouter)
app.use('/api/order', orderRouter)
app.use('/api/power-up', powerUpRouter)
app.use('/api/product', productRouter)
app.use('/api/user', userRouter)
app.use('/api/admin', adminRouter)

/* Error handling middleware */
app.use('/api', notFoundHandler)
app.use(errorHandler)

/* Start the server */
app.listen(port, () => console.log(`Backend running on http://${host}:${port}`))
