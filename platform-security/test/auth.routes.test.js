const test = require('node:test')
const assert = require('node:assert/strict')
const Fastify = require('fastify')
const authRoutes = require('../src/routes/auth')

test('login route rejects missing email with a validation error', async () => {
  const app = Fastify()
  app.register(authRoutes)

  const response = await app.inject({
    method: 'POST',
    url: '/api/auth/login',
    payload: {
      password: 'password123'
    }
  })

  assert.equal(response.statusCode, 400)
  assert.match(response.json().error.message, /email/i)
})
