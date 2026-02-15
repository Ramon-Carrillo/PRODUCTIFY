import { defineConfig } from 'drizzle-kit'
import { ENV } from './src/config/env'

if (!ENV.DB_URL) {
  throw new Error('DB_URL is required for drizzle-kit config')
}

export default defineConfig({
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: ENV.DB_URL || '',
  },
})
