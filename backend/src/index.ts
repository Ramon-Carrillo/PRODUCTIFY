import express from 'express'
import cors from 'cors'
import { ENV } from './config/env'
import { clerkMiddleware } from '@clerk/express'
import userRoutes from './routers/userRoutes'
import productRoutes from './routers/productRoutes'
import commentRoutes from './routers/commentRoutes'

const app = express()

app.use(cors({ origin: ENV.FRONTEND_URL }))
app.use(clerkMiddleware())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.json({ success: true })
})

app.use('/api/users', userRoutes)
app.use('/api/products', productRoutes)
app.use('/api/comments', commentRoutes)

app.listen(ENV.PORT, () =>
  console.log(`Server is up and running on ${ENV.PORT}`)
)
