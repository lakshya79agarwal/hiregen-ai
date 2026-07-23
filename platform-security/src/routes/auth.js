const { z } = require('zod')

const AppError = require('../utils/AppError')
const { authLimit } = require('../middleware/rateLimit')
const {
  loginHandler,
  refreshHandler,
  logoutHandler
} = require('../controllers/authController')

// Login validation
const loginSchema = z.object({
  email: z
    .string({
      required_error: 'email is required'
    })
    .min(1, 'email is required')
    .email('email must be a valid email address'),

  password: z
    .string({
      required_error: 'password is required'
    })
    .min(1, 'password is required')
})

// Refresh & Logout validation
const refreshSchema = z.object({
  refreshToken: z
    .string({
      required_error: 'refreshToken is required'
    })
    .min(1, 'refreshToken is required')
})

// Validation helper
function validate(schema, body) {
  const result = schema.safeParse(body)

  if (!result.success) {
    throw new AppError(
      result.error.issues[0].message,
      400
    )
  }

  return result.data
}

module.exports = async function authRoutes(fastify) {
  fastify.post(
    '/auth/login',
    {
      config: {
        rateLimit: authLimit
      },
      preHandler: (request) => {
        request.body = validate(loginSchema, request.body)
      }
    },
    loginHandler
  )

  fastify.post(
    '/auth/refresh',
    {
      config: {
        rateLimit: authLimit
      },
      preHandler: (request) => {
        request.body = validate(refreshSchema, request.body)
      }
    },
    refreshHandler
  )

  fastify.post(
    '/auth/logout',
    {
      config: {
        rateLimit: authLimit
      },
      preHandler: (request) => {
        request.body = validate(refreshSchema, request.body)
      }
    },
    logoutHandler
  )
}