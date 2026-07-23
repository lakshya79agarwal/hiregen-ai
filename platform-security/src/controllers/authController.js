const { success, error } = require('../utils/response')
const authService = require('../services/authService')

async function loginHandler(request, reply) {
  try {
    const result = await authService.login(request.body)

    return reply
      .code(200)
      .send(success(result, request.id))
  } catch (err) {
    return reply
      .code(err.statusCode ?? 500)
      .send(error(err.message || 'Login failed', request.id))
  }
}

async function refreshHandler(request, reply) {
  try {
    const result = await authService.refresh(request.body)

    return reply
      .code(200)
      .send(success(result, request.id))
  } catch (err) {
    return reply
      .code(err.statusCode ?? 500)
      .send(error(err.message || 'Refresh failed', request.id))
  }
}

async function logoutHandler(request, reply) {
  try {
    const result = await authService.logout(request.body)

    return reply
      .code(200)
      .send(success(result, request.id))
  } catch (err) {
    return reply
      .code(err.statusCode ?? 500)
      .send(error(err.message || 'Logout failed', request.id))
  }
}

module.exports = {
  loginHandler,
  refreshHandler,
  logoutHandler
}