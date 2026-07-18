# Developer Setup Guide - Team 1 (Platform & Security)

Quick steps to get the project running locally so we can start coding.

## Prereqs to install:
- Node.js (LTS version)
- Git (CLI or GitHub Desktop)
- PostgreSQL
- VS Code (or whatever editor you like)

## Run steps:
1. Go into the folder:
   `cd platform-security`
2. Install packages:
   `npm install` (run `npm.cmd install` if PowerShell blocks script execution)
3. Test the server:
   `node src/server.js` (should start on port 3000)

## Folder layout:
- `routes/` -> holds endpoint paths and request validations (using zod)
- `controllers/` -> connects routes to services
- `services/` -> actual logic (auth logic, password hashing, token gen)
- `repositories/` -> SQL queries only (no DB logic in services or routes)
- `middleware/` -> JWT validation and RBAC role checks
- `config/` -> DB connections and config keys

## Note:
If you need help, feel free to use ChatGPT/Claude to learn Fastify, Zod or PostgreSQL connections. If you get blocked, just send a screenshot in the group chat and we'll fix it together.
.
