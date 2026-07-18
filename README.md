# HireGen AI Platform

Welcome to the HireGen AI monorepo. This repository serves as the unified codebase for all services, applications, and shared packages.

---

## 🛠️ Local Development Infrastructure

For local development, applications run directly on your host machine to ensure hot-reloading and direct debugging. Shared infrastructure dependencies (PostgreSQL and Redis) are managed via Docker.

### Running the Infrastructure

1.  **Ensure Docker is running** on your local machine.
2.  **Start the databases** in the background:
    ```bash
    docker compose up -d
    ```
3.  **Stop the databases**:
    ```bash
    docker compose down
    ```

The databases will expose their default ports (`5432` for PostgreSQL and `6379` for Redis) to your local machine, allowing your host services to connect to them.
