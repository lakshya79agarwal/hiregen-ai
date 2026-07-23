const test = require('node:test')
const assert = require('node:assert/strict')
const { Client } = require('pg')
const { parseDuration, getTokenExpiryDate } = require('../src/services/authService')

const connectionString = process.env.DATABASE_URL

test('token duration helpers parse supported suffixes', () => {
  assert.equal(parseDuration('15m'), 15 * 60 * 1000)
  assert.equal(parseDuration('7d'), 7 * 24 * 60 * 60 * 1000)
})

test('token expiry date is computed in the future', () => {
  const now = Date.now()
  const expiry = getTokenExpiryDate('1m')

  assert.ok(expiry > now)
  assert.ok(expiry <= now + 61 * 1000)
})

test('database migration integration', { skip: !connectionString }, async (t) => {
  let client

  t.before(async () => {
    client = new Client({ connectionString })
    await client.connect()
  })

  t.after(async () => {
    if (client) {
      await client.end()
    }
  })

  await t.test('creates the expected core tables', async () => {
    const result = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name IN ('users', 'companies', 'leads', 'campaigns', 'analytics_monthly', 'audit_log')
      ORDER BY table_name
    `)

    const names = result.rows.map((row) => row.table_name)
    assert.ok(names.includes('users'))
    assert.ok(names.includes('companies'))
    assert.ok(names.includes('leads'))
    assert.ok(names.includes('campaigns'))
    assert.ok(names.includes('analytics_monthly'))
    assert.ok(names.includes('audit_log'))
  })

  await t.test('enforces a unique lead per hiring signal', async () => {
    const result = await client.query(`
      SELECT conname
      FROM pg_constraint
      WHERE conrelid = 'public.leads'::regclass
        AND contype = 'u'
    `)

    assert.ok(result.rows.length > 0)
  })
})
