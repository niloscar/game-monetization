import express from 'express'
import dotenv from 'dotenv'

import adRoutes from './routes/ad'
import authRouter from './routes/auth'
import gameRoutes from './routes/game'
import orderRoutes from './routes/order'
import productRoutes from './routes/product'
import userRouter from './routes/user'

dotenv.config()

const host = process.env.HOST || 'localhost'
const port = process.env.PORT || 3000

const app = express()

app.use(express.json())

// const PgSession = connectPgSimple(expressSession)

/* Middleware */
app.use(express.static('public'))
app.use(express.json()) 
app.use(express.urlencoded({ extended: true }))
// app.use(expressSession({
//   store: new PgSession({
//     pool
//   }),
//   secret: process.env.SECRET_KEY || 'secret-key',
//   resave: false,
//   saveUninitialized: false,
//   cookie: { 
//     httpOnly: true,
//     maxAge: 60 * 60 * 1000
//   }
// })) // Enable session support

/* API routes */
app.use('/api/ad', adRoutes)
app.use('/api/auth', authRouter)
app.use ('/api/game', gameRoutes)
app.use('/api/order', orderRoutes)
app.use('/api/product', productRoutes)
app.use('/api/user', userRouter)

app.get('/api', (req, res) => {
    res.json({
        message: 'Backend is running',
    })
})

/* Handle unknown API endpoints */
app.use('/api', (req, res) => {
  res.status(404).json({
    error: 'Ogiltig metod och/eller endpoint',
    message: `${req.method} och ${req.originalUrl} är ingen giltig kombination.`,
  })
})

app.listen(port, () => console.log(`Backend running on http://${host}:${port}`))