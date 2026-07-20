// load
require('dotenv').config()

const { z } = require('zod')

// schema
const schema = z.object({
  DB_HOST: z.string(),
  DB_PORT: z.string().default('5432'),
  DB_NAME: z.string(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  JWT_SECRET: z.string().min(32),
  REFRESH_SECRET: z.string().min(32),
  PORT: z.string().default('3000'),
  NODE_ENV: z.enum(['development', 'production']).default('development')
})

const result = schema.safeParse(process.env)

// check
if (!result.success) {
  console.error(result.error.format())
  process.exit(1)
}

module.exports = result.data
