# Coding Standards Document
### QuantDevs: CodeClash

## What is this document?
This document describes the conventions, styles, and structures that all CodeClash contributors must follow to keep the codebase readable, consistent, and maintainable across the monorepo. It is specific to our stack: **TypeScript, React, Node.js, Express, PostgreSQL, Socket.IO, Vite, and GitHub Actions**.

---

## 1. Language & TypeScript

- All source files use **TypeScript**. Plain `.js` files are not permitted in `src/` or `tests/`.
- **Strict mode** is enabled in both `tsconfig.json` files (frontend and backend). Do not disable strict flags.
- Prefer `type` over `interface` for DTOs and plain data shapes. Use `interface` for class contracts (repository interfaces, context values).
- Never use `any` unless wrapping a third-party library with no types. Prefer `unknown` and narrow explicitly.
- Use explicit return types on all exported functions and class methods.
- Use TypeScript enums (e.g. `GameMode`, `GameType`) rather than raw string literals for values shared across layers.

---

## 2. Naming Conventions

| Construct | Convention | Example |
|-----------|-----------|---------|
| Classes, Enums | PascalCase | `MatchResultService`, `GameType` |
| Interfaces, Types | PascalCase | `IEloRepository`, `MatchResultDTO` |
| Functions, methods | camelCase | `finaliseMatch`, `getUserElo` |
| Variables, parameters | snake_case (backend), camelCase (frontend) | `user_id`, `matchId` |
| Constants (module-level) | SCREAMING_SNAKE_CASE | `K_FACTOR`, `INVITE_EXPIRY` |
| React components | PascalCase | `FinalResults`, `AchievementToast` |
| React hooks | `use` prefix, camelCase | `useFriends`, `useMatchmaking` |
| Files — backend | `kebab-case.ts` | `match-result.service.ts` |
| Files — frontend | `PascalCase.tsx` for components, `camelCase.ts` for logic | `FinalResults.tsx`, `friendsContext.ts` |
| Database columns | `snake_case` | `user_id`, `match_start` |
| Socket events | `snake_case` strings | `join_match_queue`, `users_matched` |

---

## 3. Project Structure & Architecture

### Backend — Clean Architecture
The backend follows a strict four-layer architecture. Dependencies only point inward:

```
frameworks-drivers/     ← Express routes, Socket.IO handlers, config
interface-adapters/     ← Controllers, repositories, DTOs, auth middleware
application/            ← Services (use cases), interfaces (IRepository contracts)
entities/               ← DB entities (TypeORM), domain components, ECS World
```

- **Controllers** receive HTTP requests and return responses. They contain no business logic.
- **Services** contain all business logic. They depend on repository interfaces, never on concrete implementations.
- **Repositories** implement `IRepository` interfaces. They talk to TypeORM or Redis. They contain no business logic.
- **DTOs** live in `interface-adapters/dtos/`. Never return raw TypeORM entities from controllers.
- New features follow this order: entity → interface → repository → service → controller → route → swagger comment.

### Frontend — MVVM
The frontend follows the Model-View-ViewModel pattern:

```
Models/         ← Type definitions and static content strings
ViewModels/     ← Business logic hooks (data fetching, state, actions)
Views/          ← React components (rendering only, no fetch calls)
context/        ← React contexts (Auth, Socket, User, Friends, Matchmaking)
```

- Views must not contain `fetch`, `axios`, or socket emit calls directly. These belong in ViewModels or contexts.
- Context files that export both a context and a hook must add `// eslint-disable-next-line react-refresh/only-export-components` above the hook export.

---

## 4. React & Frontend

- Use **functional components** exclusively. No class components.
- All hooks must be called at the top level of a component — never inside conditionals, loops, or after an early return.
- Early returns (loading states, null guards) must come **after** all hook declarations.
- Use `useCallback` for functions passed as props or used in dependency arrays.
- Use `useMemo` only when the computation is genuinely expensive — not as a default.
- Refs (`useRef`) must not be read or written during render. Update refs inside `useEffect` or event handlers only.
- Do not call `setState` synchronously inside a `useEffect` body unless inside a conditional branch that immediately returns. Use `requestAnimationFrame` or callbacks for animation-triggered state changes.
- Avoid `any` in component props. Define a `Props` interface or type for every component.
- Import order must follow: external libraries → internal absolute imports (`src/...`) → relative imports. ESLint enforces this.

---

## 5. Backend — Express & Node.js

- All controllers follow the curried factory pattern: `export const getUser = (repo: IUserRepository) => async (req, res) => { ... }`. This enables dependency injection and testability.
- Extract the authenticated user from `req.user` (set by `requireAuth` middleware). Never trust `req.params` or `req.body` for user identity.
- All route handlers must return a response in every code path — no silent returns without a `res.json(...)`.
- HTTP status codes must be semantically correct:
  - `200` — successful read/update
  - `201` — successful creation
  - `400` — missing or invalid input
  - `401` — missing or invalid token
  - `403` — authenticated but not authorised
  - `404` — resource not found
  - `409` — conflict (duplicate request)
  - `500` — unexpected server error
- Never expose internal error messages or stack traces in `500` responses. Log the error, return `{ message: 'Internal server error' }`.
- All protected routes go after `router.use(requireAuth(user_repo))`. The catch-all `/:stat` route must always be **last** in `api.routes.ts`.

---

## 6. Database & TypeORM

- All primary keys are `UUID` generated by `gen_random_uuid()` in PostgreSQL.
- Foreign keys use TypeORM `@ManyToOne` / `@OneToOne` relations with `@JoinColumn`. Never store raw UUIDs as plain columns when a relation can be used.
- Use `snake_case` for all column names. TypeORM entity properties must match exactly.
- Init SQL files are numbered and run in order: `01-init.sql`, `02-init-questions.sql`, `03-init-achievements-friends.sql`. New schema changes go in a new numbered file.
- Do not drop or recreate types that already exist. Use `DO $$ BEGIN ... EXCEPTION WHEN duplicate_object THEN NULL; END $$;` for `CREATE TYPE` statements in init files.
- TypeORM `synchronize` is enabled only in development. Never enable it in production.

---

## 7. Socket.IO

- All socket event names use `snake_case` strings: `join_match_queue`, `match_accepted`, `friend_invite_received`.
- Socket handlers in `server.ts` are thin wrappers that call handler functions in `interface-adapters/socket-handlers/`. No business logic in `server.ts`.
- Always validate socket data before use. If required fields are missing, emit an error event back to the client and return early — never let the server crash.
- Match state during a live game lives in the ECS world (in-memory). It is only persisted to PostgreSQL when the match concludes.
- Redis backs the matchmaking queue and game cache. Do not use Redis for anything that requires transactional integrity — use PostgreSQL for that.

---

## 8. Commenting & Documentation

- Use single-line `//` comments above the code they describe, never on the same line.
- All exported controller functions, services, and repository methods must have a one-line summary comment.
- All active API routes must have a `@swagger` JSDoc block directly above the `router.xxx(...)` call. Indentation must be exactly 3 spaces per level (Swagger YAML is strict).
- Do not leave `TODO` comments in code that is being merged to `dev`. Either resolve them or create a GitHub issue and reference it.
- Do not comment out code in merged PRs. Delete it. Git history preserves it.

---

## 9. Error Handling

- All `async` controller and service functions must be wrapped in `try/catch`.
- Catch blocks must `console.error(...)` the error for server-side logging and return an appropriate HTTP response.
- Never `throw` from inside a controller — catch at the controller level and map to an HTTP status.
- Services may throw typed errors (e.g. `throw new Error('Friend request already exists')`). Controllers catch these and map to the correct status code.
- Repository methods return `null` when a record is not found. Controllers check for `null` and return `404`.

---

## 10. Testing

- All unit tests use **Vitest**.
- Integration tests (real DB) live in `tests/integration/` and are excluded from the standard CI run (`vitest run`). They run against `DATABASE_TEST_URL`.
- Test files mirror the source structure: `src/application/usecases/services/match-result.service.ts` → `tests/unit/usecases/services/match-result.service.test.ts`.
- Unit tests mock all external dependencies (database, Redis, socket) using `vi.fn()`. No real network calls in unit tests.
- Every test follows **Arrange → Act → Assert** with a blank line between each section.
- Describe blocks group by class/function. `it` descriptions are written as full sentences stating the expected behaviour.
- Minimum 80% statement and branch coverage on `src/application/` (services and use cases).

---

## 11. Git & GitHub Actions

- Branch naming: `feature/<description>-<name>`, `fix/<description>`, `chore/<description>`.
- Commit messages: imperative present tense — `feat: add friend request endpoint`, `fix: correct game_mode enum mismatch`, `chore: update init.sql`.
- All changes into `dev` via pull request. Direct pushes to `dev` and `main` are blocked.
- PRs require **2 approving reviews** from team members with write access who are not the last pusher.
- The CI pipeline (`ci.yml`) runs on every PR: lint → build → test. A failing check blocks merge.
- Use `--no-verify` only when committing work-in-progress on a personal feature branch. Never bypass CI on PRs.
- Pull from `dev` into your feature branch using `git pull origin dev --no-rebase` before opening a PR. Resolve conflicts locally.
- After rebasing (if used), always force-push your feature branch immediately: `git push --force origin your-branch`. Never force-push to `dev` or `main`.

---

## 12. Indentation & Layout

- Use **2 spaces** for indentation across all TypeScript, TSX, SQL, and YAML files. No tabs.
- Opening braces on the same line as the statement.
- One blank line between logical sections within a function.
- Imports are grouped: external packages → internal absolute (`src/`) → relative. A blank line separates each group. ESLint enforces import order.
- Maximum line length: 120 characters.
