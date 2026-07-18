# Team 1 (Platform & Security) — Developer Setup Guide

Welcome to the team! Below is the step-by-step guide to setting up the project locally on your machine and how our folder structure is organized.

---

## 🛠️ 1. Software to Install (Prerequisites)

Please ensure you have these installed on your laptop:
1. **Node.js** (LTS Version): [Download Link](https://nodejs.org/)
2. **Git**: [Download Link](https://git-scm.com/)
3. **VS Code** (or your favorite editor): [Download Link](https://code.visualstudio.com/)
4. **PostgreSQL** (Local database): [Download Link](https://www.postgresql.org/download/)
5. **GitHub Desktop** (Optional, if you prefer visual Git instead of commands): [Download Link](https://desktop.github.com/)

---

## 🚀 2. Getting the Code Running

Run these commands in your VS Code Terminal:

### Step 1: Clone the Repository
```bash
git clone https://github.com/HireGen-Platform/hiregen-ai.git
```
*(Or open the repository directly using GitHub Desktop)*

### Step 2: Open our Team folder
```bash
cd hiregen-ai/platform-security
```

### Step 3: Install all packages
```bash
npm install
```
*(If you get a PowerShell script blocked error, run `npm.cmd install` instead)*

### Step 4: Start the server
```bash
node src/server.js
```
You should see: `Platform & Security server is running on http://localhost:3000`

---

## 📂 3. Visual Folder Structure

Here is how our project is organized under the `platform-security` folder, following the standard Repository & Layering Pattern:

```text
platform-security/
├── package.json           # List of packages/dependencies (fastify, pg, zod, etc.)
└── src/
    ├── server.js          # Entry point. Starts the Fastify server.
    │
    ├── routes/            # Defining URL paths (e.g., /login, /refresh)
    │                      # & validating user input using Zod.
    │
    ├── controllers/       # Takes request from routes and sends it to services.
    │
    ├── services/          # Core Business Logic (e.g., matching password hashes, 
    │                      # generating JWT tokens).
    │
    ├── repositories/      # Database queries (All raw SQL queries live here. 
    │                      # One file per DB table).
    │
    ├── middleware/        # Guards (e.g., checking if user has valid JWT token 
    │                      # or checking user roles like ADMIN/MANAGER).
    │
    └── config/            # Configuration files (Database credentials, env variables).
```

---

## 🤝 4. Workflow Rules
* **No Direct DB in Routes:** Routes should never talk to the Database directly.
* **No SQL in Services:** Services should never write raw SQL query strings.
* **Repositories only for SQL:** All database interaction must stay in `repositories/`.
* **Always use a Branch:** Never push code directly to `master`/`main`. Always create a branch first:
  ```bash
  git checkout -b task-name
  ```
