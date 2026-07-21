const fs = require('node:fs')
const path = require('node:path')
const dotenv = require('dotenv')
const { z } = require('zod')

const candidates = [
  path.resolve(__dirname, '../../.env'),
  path.resolve(__dirname, '../../../.env'),
  path.resolve(process.cwd(), '.env')
]

for (const candidate of candidates) {
  if (fs.existsSync(candidate)) {
    dotenv.config({ path: candidate })
    break
  }
}

if (!process.env.JWT_SECRET || !process.env.REFRESH_SECRET) {
  dotenv.config()
}

const schema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  DB_HOST: z.string().optional(),
  DB_PORT: z.coerce.number().int().min(1).max(65535).default(5432),
  DB_NAME: z.string().optional(),
  DB_USER: z.string().optional(),
  DB_PASSWORD: z.string().optional(),
  DATABASE_URL: z.string().url().optional(),
  JWT_SECRET: z.string().min(32),
  REFRESH_SECRET: z.string().min(32),
  FRONTEND_URL: z.string().url().optional()
})

const result = schema.safeParse(process.env)

if (!result.success) {
  console.error(result.error.format())
  process.exit(1)
}

const env = result.data
const hasDirectDb = Boolean(env.DB_HOST && env.DB_NAME && env.DB_USER && env.DB_PASSWORD)
const hasDatabaseUrl = Boolean(env.DATABASE_URL)

if (!hasDirectDb && !hasDatabaseUrl) {
  console.error('Set DB_HOST, DB_NAME, DB_USER, DB_PASSWORD or DATABASE_URL')
  process.exit(1)
}

module.exports = {
  ...env,
  PORT: String(env.PORT),
  DB_PORT: String(env.DB_PORT)
}
