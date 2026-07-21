# Setup Guide

## Prereqs
- Node.js LTS
- npm
- PostgreSQL or a valid DATABASE_URL

## Local setup
1. Copy the example env file:
   - `copy platform-security\.env.example platform-security\.env`
2. Fill the values in `platform-security/.env`.
3. Install packages:
   - `npm install --prefix platform-security`
4. Start the service:
   - From repo root: `npm run dev`
   - Or from service folder: `npm --prefix platform-security run dev`

## Production setup
- Set the same variables in your host, Docker, or cloud platform.
- Use strong JWT secrets.
- Keep `.env` local. Do not commit it.

## Notes
- If you use a cloud database, set `DATABASE_URL` and skip the DB host fields.
- If you use local Postgres, keep `DB_HOST`, `DB_NAME`, `DB_USER`, and `DB_PASSWORD` in `.env`.
