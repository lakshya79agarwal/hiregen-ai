const { z } = require('zod')
const AppError = require('../utils/AppError')
const { authLimit } = require('../middleware/rateLimit')
const { error: errorResponse } = require('../utils/response')
const { loginHandler, refreshHandler, logoutHandler } = require('../controllers/authController')

const loginSchema = z.object({
  email: z
    .string({ required_error: 'email is required' })
    .trim()
    .min(1, 'email is required')
    .email('email must be a valid email address'),
  password: z
    .string({ required_error: 'password is required' })
    .min(1, 'password is required')
})

const refreshSchema = z.object({
  refreshToken: z
    .string({ required_error: 'refreshToken is required' })
    .min(1, 'refreshToken is required')
})

function validate(schema, body) {
  const result = schema.safeParse(body)

  if (!result.success) {
    throw new AppError(result.error.issues[0].message, 400)
  }

  return result.data
}

module.exports = async function authRoutes(fastify) {
  fastify.setErrorHandler((err, request, reply) => {
    if (err.isOperational) {
      return reply.code(err.statusCode).send(errorResponse(err.message, request.id))
    }

    if (err.validation || err.statusCode === 400) {
      return reply.code(400).send(errorResponse(err.message || 'Validation error', request.id))
    }

    request.log.error(err)
    const message = process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message

    return reply.code(500).send(errorResponse(message, request.id))
  })

  fastify.post(
    '/api/auth/login',
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
    '/api/auth/refresh',
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
    '/api/auth/logout',
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
