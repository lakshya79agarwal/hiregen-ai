Backend Service
## What this service does

- Provides JWT login, refresh, and logout
- Stores refresh tokens safely in PostgreSQL
- Uses Fastify for routes and middleware
- Enforces role-based access control (RBAC)
- Uses plain SQL queries, not an ORM
- Applies versioned migrations to build database schema
- Seeds a default admin account for local/dev use: admin@hiregen.ai / Admin@123

## How to use it

1. Copy the example env file:

```powershell
copy .env.example .env
```

2. Fill the required values in `platform-security/.env`

3. Install packages:

```powershell
npm install
```

4. Run database migrations:

```powershell
npm run migrate
```

> Migration is required only when setting up a new database or when database schema changes are added. Do not run it every time unless the schema is updated or the DB is new.

5. Start the server:

```powershell
npm run start
```

## Default admin access

- The service seeds a default admin user on startup with the credentials admin@hiregen.ai / Admin@123.
- Use this admin account to log in first, then create or manage other users and assign roles such as ADMIN or MANAGER.
- The protected admin route allows roles ADMIN and MANAGER, so RBAC behavior is enforced through the middleware chain.

## JWT secret setup

- `JWT_SECRET` and `REFRESH_SECRET` must be set manually in `.env`.
- They are not generated automatically by the service.
- Set these once and do not change them for every token expiry.
- Use strong random strings with at least 32 characters.
- Keep them private and do not commit them to Git.

Example generation command:

```powershell
cd platform-security
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

## Database setup for the team

- Each teammate can use their own database credentials.
- They can use either `DATABASE_URL` or the individual DB variables.
- If the DB is local, the database server must be running.
- If the DB is remote, only network access is required.

### Recommended environment variables

```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your-password
JWT_SECRET=your-32-character-secret
REFRESH_SECRET=your-32-character-secret
DATABASE_URL=postgresql://postgres:your-password@localhost:5432/postgres
```

## How to verify the database

Use a SQL client or `psql`:

```sql
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
SELECT id, email, role FROM users;
SELECT id, user_id, revoked, expires_at FROM refresh_tokens LIMIT 10;
```

## Main files team should know

- `src/server.js` — starts the service and loads routes
- `src/config/env.js` — validates environment variables
- `src/config/db.js` — connects to PostgreSQL
- `src/routes/auth.js` — auth endpoints
- `src/routes/admin.js` — protected admin endpoint
- `src/controllers/` — handles requests and responses
- `src/services/authService.js` — auth logic and token handling
- `src/repositories/` — database SQL operations
- `src/middleware/` — token and role checks
- `migrations/` — database schema and indexes


