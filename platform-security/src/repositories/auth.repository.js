const pool = require('../config/db')

const saveRefreshToken = async (userId, tokenHash, expiresAt) => {
  const result = await pool.query(
    `INSERT INTO refresh_tokens (user_id, token_hash, expires_at, created_at, updated_at)
     VALUES ($1, $2, $3, NOW(), NOW())
     ON CONFLICT (token_hash) DO UPDATE
       SET revoked = FALSE,
           expires_at = EXCLUDED.expires_at,
           updated_at = NOW()
     RETURNING *`,
    [userId, tokenHash, expiresAt]
  )

  return result.rows[0]
}

// defensive upsert in case of race or unexpected unique violation
const saveRefreshTokenSafe = async (userId, tokenHash, expiresAt) => {
  try {
    return await saveRefreshToken(userId, tokenHash, expiresAt)
  } catch (err) {
    if (err && err.code === '23505') {
      const res = await pool.query(
        `UPDATE refresh_tokens
         SET revoked = FALSE, expires_at = $2, updated_at = NOW()
         WHERE token_hash = $1
         RETURNING *`,
        [tokenHash, expiresAt]
      )

      return res.rows[0]
    }

    throw err
  }
}

const getRefreshToken = async (tokenHash) => {
  const result = await pool.query(
    `SELECT * FROM refresh_tokens
     WHERE token_hash = $1
       AND revoked = FALSE
       AND expires_at > NOW()`,
    [tokenHash]
  )

  return result.rows[0]
}

const revokeRefreshToken = async (tokenHash) => {
  await pool.query(
    `UPDATE refresh_tokens
     SET revoked = TRUE
     WHERE token_hash = $1`,
    [tokenHash]
  )
}

module.exports = {
  saveRefreshToken: saveRefreshTokenSafe,
  getRefreshToken,
  revokeRefreshToken
}
