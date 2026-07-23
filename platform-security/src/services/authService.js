const crypto = require('node:crypto')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const env = require('../config/env')
const AppError = require('../utils/AppError')

const {
  findByEmail,
  findById
} = require('../repositories/user.repository')

const {
  saveRefreshToken,
  getRefreshToken,
  revokeRefreshToken
} = require('../repositories/auth.repository')

function generateAccessToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role
    },
    env.JWT_SECRET,
    {
      expiresIn: '15m'
    }
  )
}

function generateRefreshToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      type: 'refresh'
    },
    env.REFRESH_SECRET,
    {
      expiresIn: '7d'
    }
  )
}

function hashToken(token) {
  return crypto
    .createHash('sha256')
    .update(token)
    .digest('hex')
}

async function login(data) {
  const { email, password } = data

  const normalizedEmail = email.trim().toLowerCase()

  const user = await findByEmail(normalizedEmail)

  if (!user) {
    throw new AppError('Invalid credentials', 401)
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    user.password_hash
  )

  if (!isPasswordValid) {
    throw new AppError('Invalid credentials', 401)
  }

  if (!user.is_active) {
    throw new AppError(
      'Account is inactive',
      403
    )
  }

  const accessToken = generateAccessToken(user)
  const refreshToken = generateRefreshToken(user)

  const refreshTokenHash = hashToken(refreshToken)

  const expiresAt = new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000
  )

  await saveRefreshToken(
    user.id,
    refreshTokenHash,
    expiresAt
  )

  return {
    user: {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      role: user.role
    },
    accessToken,
    refreshToken
  }
}

async function refresh(data) {
  const { refreshToken } = data

  let decoded

  try {
    decoded = jwt.verify(
      refreshToken,
      env.REFRESH_SECRET
    )
  } catch {
    throw new AppError(
      'Invalid or expired token',
      401
    )
  }

  if (decoded.type !== 'refresh') {
    throw new AppError(
      'Invalid refresh token',
      401
    )
  }

  const refreshTokenHash = hashToken(refreshToken)

  const storedToken = await getRefreshToken(
    refreshTokenHash
  )

  if (!storedToken) {
    throw new AppError(
      'Invalid or expired token',
      401
    )
  }

  if (storedToken.revoked) {
    throw new AppError(
      'Refresh token has already been used. Please log in again.',
      401
    )
  }

  if (new Date(storedToken.expires_at) < new Date()) {
    throw new AppError(
      'Refresh token has expired. Please log in again.',
      401
    )
  }

  const user = await findById(decoded.sub)

  if (!user || !user.is_active) {
    throw new AppError(
      'Invalid or expired token',
      401
    )
  }

  await revokeRefreshToken(refreshTokenHash)

  const newAccessToken = generateAccessToken(user)
  const newRefreshToken = generateRefreshToken(user)

  const newRefreshTokenHash = hashToken(
    newRefreshToken
  )

  const expiresAt = new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000
  )

  await saveRefreshToken(
    user.id,
    newRefreshTokenHash,
    expiresAt
  )

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken
  }
}

async function logout(data) {
  const { refreshToken } = data

  const refreshTokenHash = hashToken(refreshToken)

  await revokeRefreshToken(refreshTokenHash)

  return {
    message: 'Logged out successfully'
  }
}

module.exports = {
  login,
  refresh,
  logout
}