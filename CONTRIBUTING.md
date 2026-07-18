# Contributing Guidelines

Welcome! With multiple teams contributing, following these basic rules keeps the repository clean and stable.

---

## 1. Branch Naming
Create a new branch for every task. Name your branch using the format:
`feature/<team-number>/<short-description>` or `fix/<team-number>/<short-description>`

*Examples:*
*   `feature/team4/database-schema`
*   `fix/team2/api-validation`

---

## 2. Commit Messages
Use clear prefixes for commit messages (Conventional Commits):
*   `feat:` when introducing a new feature
*   `fix:` when correcting a bug
*   `docs:` when modifying markdown files or documentation
*   `chore:` for general housekeeping or package updates

*Examples:*
*   `feat: added database reconnection retry logic`
*   `fix: resolved crash on redis disconnect`

---

## 3. Pull Request Process
*   **Never push directly to `main`.** All changes must go through a Pull Request (PR).
*   **Keep PRs focused:** Submit one small, testable change per PR rather than combining multiple tasks.
*   **Review:** Ensure your PR has at least one approval before merging.

---

## 4. Getting Help
*   If you are blocked by infrastructure or local environment issues, do not sit on it silently. Reach out in the team communication channels.
