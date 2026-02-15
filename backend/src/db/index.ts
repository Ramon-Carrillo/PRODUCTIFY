import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'
import { ENV } from '../config/env'

if (!ENV.DB_URL) {
  throw new Error('DB_URL is not defined in environment variables')
}

const pool = new Pool({ connectionString: ENV.DB_URL })

pool.on('connect', () => {
  console.log('Connected to the database')
})

pool.on('error', (err) => {
  console.error('Database connection error:', err)
})

export const db = drizzle(pool, { schema })
