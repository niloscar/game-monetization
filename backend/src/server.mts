import express from 'express'
import expressSession from 'express-session'
import connectPgSimple from 'connect-pg-simple'
import { pool } from './database'
import dotenv from 'dotenv'
import cors from 'cors'

import adRoutes from './routes/ad'
import authRouter from './routes/auth'
import gameRoutes from './routes/game'
import orderRoutes from './routes/order'
import productRoutes from './routes/product'
import userRouter from './routes/user'
import testRouter from './routes/test'
import adminUserRouter from './routes/admin/user'

dotenv.config()

const host = process.env.HOST || 'localhost'
const port = process.env.PORT || 3000

const app = express()

app.use(
    cors({
        origin: 'http://localhost:5173',
        credentials: true
    })
)

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
app.use('/api/ad', adRoutes)
app.use('/api/auth', authRouter)
app.use('/api/game', gameRoutes)
app.use('/api/order', orderRoutes)
app.use('/api/product', productRoutes)
app.use('/api/user', userRouter)
app.use('/api/test', testRouter)
app.use('/api/admin/users', adminUserRouter)

/* Handle unknown API endpoints */
app.use('/api', (req, res) => {
    res.status(404).json({
        error: 'Ogiltig metod och/eller endpoint',
        message: `${req.method} och ${req.originalUrl} är ingen giltig kombination.`
    })
})

app.listen(port, () => console.log(`Backend running on http://${host}:${port}`))
