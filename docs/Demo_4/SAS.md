# Software Architecture Specification
## CodeClash
**Version:** 3.1 — Demo 3

---

## Table of Contents
1. [Introduction](#1-introduction)
2. [Architectural Requirements](#2-architectural-requirements)
3. [Technology Requirements](#3-technology-requirements)
4. [API Contracts](#4-api-contracts)
5. [Mapping Quality Requirements to Architectural Decisions](#5-mapping-quality-requirements-to-architectural-decisions)
6. [NFR Traceability Matrix](#6-nfr-traceability-matrix)
7. [Deployment](#7-deployment)

---

## 1. Introduction

### 1.1 Purpose
This document specifies the software architecture for **CodeClash**, a competitive 1v1 gaming platform where players solve mathematics and programming problems in real time. Where the Software Requirements Specification (SRS) defines *what* the system must do, this document defines *how* the system is structured to satisfy those requirements.

### 1.2 Scope
This document covers the architectural patterns, design patterns, constraints, technology decisions, API contracts, and deployment strategy for the CodeClash platform. It is intended for developers and stakeholders involved in the implementation, review, and evaluation of the system.

### 1.3 References
- `SRS.md` — Software Requirements Specification
- `coding-standards.md` — Coding Standards Document
- `api-spec.json` — Full OpenAPI 3.0 specification (v2.1.0, machine-readable)
- `/docs/Demo_3/diagrams/` — Architecture, deployment, and CI/CD diagrams

---

## 2. Architectural Requirements

### 2.1 Architectural Patterns

#### Client-Server
The system as a whole uses a client-server pattern. The React SPA frontend acts as a client that connects to the Node.js backend through both a REST API and a persistent WebSocket connection.

#### Layered Architecture (Clean Architecture)
The backend is implemented with a strictly layered architecture following Clean Architecture principles. Dependencies only point inward — outer layers may depend on inner layers, but inner layers are completely unaware of outer layers.

```
frameworks-drivers/     ← Express routes, Socket.IO server, Docker config
interface-adapters/     ← Controllers, repositories, DTOs, auth middleware, error handling
application/            ← Use case services, repository interfaces (IRepository)
entities/               ← TypeORM DB entities, ECS World, ECS components
```

This allows the database, framework, and transport layer to be replaced without touching business logic.

##### Entity Layer
The innermost layer. Contains TypeORM database entities (`Users`, `Matches`, `MatchLog`, `MatchStats`, `Achievement`, `Friendship`, shop entities, etc.), ECS components (`MatchComponent`, `SubmissionComponent`, `LifeComponent`), and the ECS World that manages live match state in memory. A player's ELO is stored on the `Users` entity.

##### Application Layer
Contains all application-specific business logic. Services implement use cases and expose `IRepository` interfaces that the outer layer implements. This layer has no knowledge of Express, TypeORM, or Socket.IO.

| Domain | Services |
|--------|----------|
| Matches | `MatchmakingService`, `MatchCompletionService` |
| Rankings | `LeaderboardService` |
| Tournaments | `TournamentService` |
| Social | `FriendService`, `AchievementService` |
| Shop | `ShopItemService`, `InventoryService`, `WalletService`, `EquipmentService`, `PowerupService`, `PurchaseService` |

Each service depends on its repository interfaces (for example `IUserRepository`, `IFriendRepository`, `IAchievementRepository`, and the shop repository interfaces), never on a concrete implementation.

##### Interface Adapters
Converts data between the application layer format and external system formats. Contains controllers (HTTP request/response mapping), repositories (TypeORM queries), DTOs (data shape definitions), authentication middleware (JWT verification via AWS Cognito), and the centralised error handler.

###### Centralised Error Handling
Errors are modelled with a single `HttpError(status, message)` class. Services throw `HttpError` for client-actionable failures (for example a missing resource or a duplicate request). A final Express 5 error-handling middleware catches every thrown error, returns `{ message }` with the status carried by the `HttpError`, and converts anything that is not an `HttpError` into a generic `500 Internal server error` so internal details are never leaked. Controllers therefore contain no per-route `try/catch` response formatting.

##### Frameworks and Drivers
The outermost layer. Contains Express route registration, Socket.IO server setup, Docker configuration, TypeORM `AppDataSource`, and Redis client initialisation. All technology-specific wiring lives here.

---

#### Entity Component System (ECS)
Live match state is managed using a custom ECS pattern. During an active match, players, rounds, and submissions are represented as entities with attached components held in application memory. This provides zero-latency state reads during gameplay without hitting the database.

Match state is only persisted to PostgreSQL when the match concludes (`FinishGame` system). If the server restarts mid-match, the in-memory state is lost — this is an accepted constraint for the current version.

Components include: `MatchComponent`, `PlayersComponent`, `SubmissionRegistryComponent`, `SubmissionComponent`, `LifeComponent`, `RoundComponent`, `ResultComponent`.

---

#### Event-Driven Architecture (WebSocket)
Time is a determining factor in CodeClash matches. The game system uses Socket.IO for real-time event routing rather than polling. The server acts as the event bus:

- **Matchmaking events:** `join_match_queue`, `leave_match_queue`, `users_matched`, `match_accepted`, `match_declined`
- **Game events:** `send_questions`, `send_players`, `submit_question`, `question_started`, `game_done`, `send_results`, `clean_up`
- **Social events:** friend requests, responses, and casual play invites (see §4.3)
- **Tournament events:** see §4.3

Redis backs the matchmaking queue and game cache, ensuring state survives socket disconnects.

---

#### Model-View-ViewModel (MVVM) — Frontend
The React frontend implements MVVM:

- **Models** — TypeScript type definitions and static content strings (`FriendsModel.ts`, `AchievementsModel.ts`)
- **ViewModels** — Custom hooks containing all data fetching, socket emission, and state logic (`FriendsContext.tsx`, `AchievementsViewModel.ts`, `DashboardViewModel.ts`)
- **Views** — React components responsible only for rendering (`Friends.tsx`, `Dashboard.tsx`, `FinalResults.tsx`)

Views contain no `fetch`, `axios`, or socket calls. All external communication goes through ViewModels or contexts.

---

#### Single-Page Application (SPA)
The React frontend is a single-page application served via Nginx in production. Navigation between screens does not trigger full-page reloads. All routing is handled client-side via React Router.

---

### 2.2 Design Patterns

| Pattern | Where Applied |
|---------|--------------|
| **Strategy Pattern** | Rating updates vary by game context. `updateEloAfterMatch` applies the standard Elo formula (K=32) for head-to-head matches, while `updateEloAfterTournament` applies a placement-based adjustment for tournaments. Answer validation varies by game mode (math vs programming), each handled by separate submission logic. |
| **Repository Pattern** | All database access is abstracted behind `IRepository` interfaces (`IUserRepository`, `IMatchResultRepository`, `IFriendRepository`, `IAchievementRepository`, and the shop repository interfaces). Services depend on the interface, enabling repository mocking in unit tests. |
| **Data Transfer Object (DTO)** | Data crossing layer boundaries is encapsulated in strongly-typed DTOs (`MatchResultDTO`, `PlayerStatsDTO`, `FriendDTO`, `AchievementDTO`). Raw TypeORM entities never leave the repository layer. |
| **Factory / Curried Controller** | All controllers follow the factory pattern: `export const getUser = (repo: IUserRepository) => async (req, res) => { ... }`. This enables dependency injection at route registration time without a DI framework. |
| **Observer / Event Emitter** | Achievement evaluation is triggered after match completion and after friend acceptance. `AchievementService.evaluateAndAward` checks all conditions and awards newly unlocked achievements, decoupled from the match and friends systems. |
| **Context Provider** | Frontend global state (auth, socket, user, matchmaking, friends, achievement toasts) is managed via React Context with custom hooks (`useAuth`, `useSocket`, `useFriends`, `useAchievementToast`). |

---

### 2.3 Constraints

| Constraint | Detail |
|------------|--------|
| **Desktop-first** | The programming battle UI is designed and tested for desktop viewports (1440×1024 px minimum). Mobile is out of scope for the current version. |
| **Two-player only** | Each match links exactly two players. Multiplayer lobbies are not supported. |
| **Ranked ELO is immutable by players** | Only Managers may manually adjust ELO. Automated updates occur only at match or tournament conclusion (K=32 for matches, starting rating 600). |
| **Code execution isolation** | User code must never execute outside of the Judge0 sandbox. Direct server-side execution is prohibited. The Judge0 container runs in the NFR test stack; integration into the code execution flow is planned for Demo 4. |
| **In-memory match state** | Live match data (ECS world, submissions, life totals) is held in application memory during a match and is not persisted to the database until match conclusion. A server restart mid-match loses the in-memory state. |
| **Branch discipline** | `main` must always reflect a deployable system. All changes enter via pull request into `dev`, then promoted to `main`. Direct pushes to `dev` and `main` are blocked by branch protection rules. |
| **No hardcoded secrets** | All environment-specific configuration is managed through `.env` files. Nothing is hardcoded in source. |
| **Casual play** | The casual game mode (friend invites, casual matches) is planned for Demo 4. The infrastructure is in place (friend system, invite codes, socket handlers) but the full casual match flow is not yet active. |
| **Powerups hidden (Demo 3)** | Powerup endpoints exist, but powerups are hidden in the shop UI for Demo 3. |
| **Play-invite hidden (Demo 3)** | The friends "invite to play" button is hidden in the UI for Demo 3. |

---

### 2.4 Architectural Diagram

[Architecture Diagram](/docs/Demo_3/diagrams/architecture-diagram.png)

---

## 3. Technology Requirements

### 3.1 Frontend

| Concern | Technology | Justification |
|---------|-----------|---------------|
| Framework | React 19 (SPA) | Component-based architecture suits the real-time, state-heavy game UI. |
| Language | TypeScript (strict) | Static typing catches interface mismatches between frontend and backend DTOs at compile time. |
| Bundler | Vite | Fast HMR for development; optimised production builds with Nginx static serving. |
| Styling | Tailwind CSS + global CSS variables | Utility-first classes with a design token system ensure visual consistency across all views. |
| Real-time | Socket.IO client | Matches the Socket.IO server on the backend; handles reconnection and fallback automatically. |
| Math input | MathLive | Renders LaTeX in real time; provides a virtual keyboard for mathematical symbol input without requiring LaTeX knowledge. |
| Code editor | Monaco Editor | Full IDE-like experience for the programming battle mode; syntax highlighting and auto-indentation. |
| Authentication | AWS Amplify / Cognito | Integrates with the Cognito user pool; handles token refresh and session persistence. |
| HTTP client | Axios + native fetch | Axios for match history; native fetch for friends, achievements, and user context calls. |
| State management | React Context + custom hooks | Auth, socket, user, matchmaking, friends, and achievement toasts each have a dedicated context. |

---

### 3.2 Backend

| Concern | Technology | Justification |
|---------|-----------|---------------|
| Runtime | Node.js (v22) | Event-loop model handles many concurrent WebSocket connections efficiently. Node 22 is also required by Vitest 4. |
| Framework | Express 5.x | Minimal HTTP framework; Express 5 forwards errors from async handlers to the error middleware, which the centralised error handler relies on. |
| Language | TypeScript (strict) | Enables strict typing across all layer boundaries; enforced at compile time via `tsc`. |
| ORM | TypeORM | Decorators-based entity definition aligns with the Clean Architecture entity layer. |
| Authentication | AWS Cognito | JWT issuance, password hashing, and token refresh offloaded to a managed service. |
| Real-time | Socket.IO (server) | Handles WebSocket upgrade, rooms, and reconnection; emits match events to individual player rooms. |
| In-memory state | Custom ECS (World) | Lightweight entity-component system holds live match state for zero-latency reads during gameplay. |
| Queue / Cache | Redis | Sub-millisecond read/write for the matchmaking queue and game cache; `appendonly yes` persistence. |
| API style | REST + WebSocket | REST for stateless CRUD (profile, history, leaderboard, friends, achievements, shop, tournaments); WebSocket for real-time match events. |
| API documentation | OpenAPI 3.0 (SwaggerHub) | Hand-maintained specification (v2.1.0) exported to `api-spec.json`; kept as the source of truth for the service contract. |

---

### 3.3 Code Execution *(planned — Demo 4)*

| Concern | Technology | Justification |
|---------|-----------|---------------|
| Execution engine | Judge0 | Battle-tested sandbox; supports multiple languages; enforces CPU/memory limits. |
| Isolation | Sandboxed container | Network isolation and resource quotas prevent runaway submissions from affecting other services. |
| Current status | Runs in the test stack only | Judge0 is containerised and used by the reliability NFR test (the test kills it and asserts the backend survives). It is not yet wired into the match submission flow; that integration is planned for Demo 4. |

---

### 3.4 Data

| Concern | Technology | Justification |
|---------|-----------|---------------|
| Database | PostgreSQL 15 | Relational model suits users, matches, ELO, achievements, friendships, and the shop; ACID guarantees protect match result integrity. |
| Cache / Queue | Redis | Matchmaking queue and game cache; persistence mode guards against data loss on restart. |
| Primary keys | UUID (`gen_random_uuid()`) | Prevents enumeration attacks; decouples ID generation from the database sequence. |
| Schema management | Numbered SQL init files | `01-init.sql` → `02-init-questions.sql` → `03-init-achievements-friends.sql` → `03-init-shop.sql` run in order on DB initialisation. |

---

### 3.5 DevOps & Tooling

| Concern | Technology | Justification |
|---------|-----------|---------------|
| Containerisation | Docker + Docker Compose | `docker-compose up` spins up the full stack (backend, frontend, PostgreSQL, Redis, pgAdmin) in one command. |
| Cloud deployment | AWS | Dockerised services deployed to AWS; environment variables injected at deploy time, never committed. |
| CI/CD | GitHub Actions | Lint → build → test on every PR into `dev` and `main`; failing checks block merge. |
| Linting | ESLint (v10) | Enforces import order, no-unused-vars, TypeScript strict rules, and React hooks rules across the monorepo. |
| Testing | Vitest 4 | Fast, native ESM; compatible with TypeScript. Unit tests in `tests/unit/`; integration tests (excluded from CI) in `tests/integration/`. |
| Load testing | k6 | Scriptable load profiles with built-in latency percentiles and thresholds; used for the performance NFR. |
| Security scanning | jwt_tool | Forces malformed, expired, and tampered JWTs against protected endpoints to verify every one is rejected. |
| Secret management | `.env` + `.env.example` | Secrets gitignored locally; injected as environment variables in deployed environments. |

---

## 4. API Contracts

### 4.1 Service Contract

The full CodeClash service contract is defined in **OpenAPI 3.0** format (version 2.1.0) and is available as:

- **Interactive UI:** `http://localhost:3000/api-docs` (when backend is running)
- **Machine-readable spec:** [`/docs/Demo_3/api-spec.json`](/docs/Demo_3/api-spec.json)

The specification is maintained by hand in SwaggerHub and exported to `api-spec.json`. It is the source of truth for request and response shapes.

---

### 4.2 REST API Summary

All REST endpoints require `Authorization: Bearer <JWT>` (issued by AWS Cognito) unless noted. Base URL: `http://localhost:3000/api` (development).

| Tag | Endpoint | Method | Description |
|-----|----------|--------|-------------|
| **Auth** | `/create-user` | POST | Create the database user after Cognito sign-up. Requires a valid Cognito token only; mounted before `requireAuth`. |
| **Leaderboard** | `/leaderboard` | GET | Ranked players by ELO. Authenticated. Supports `?limit` and `?page`. |
| **Users** | `/user/rank` | GET | Authenticated user's global rank position |
| **Users** | `/user/search` | GET | Search users by username (`?q=<query>`, min 2 chars) |
| **Users** | `/user/:stat` | GET | Any single attribute of the authenticated user: `username`, `email`, `avatar_id`, `league`, `current_streak`, `winning_streak` |
| **Users** | `/skill-progress` | GET | Authenticated user's skill progress |
| **Matches** | `/matches` | GET | Authenticated user's match history |
| **Matches** | `/matches/:match_id` | GET | Details of a specific match |
| **Tournaments** | `/tournament/:status` | GET | Tournaments filtered by status |
| **Friends** | `/friends` | GET | All accepted friends of the authenticated user |
| **Friends** | `/friends/requests` | GET | Sent or received pending friend requests (`?type=sent\|received`) |
| **Friends** | `/friends/request` | POST | Send a friend request (`{ receiver_id }`) |
| **Friends** | `/friends/request/:friendship_id` | PATCH | Accept or decline a request (`{ status: "accepted"\|"declined" }`) |
| **Friends** | `/friends/:friendship_id` | DELETE | Remove a friend |
| **Friends** | `/friends/invite` | POST | Create a casual game invite code |
| **Achievements** | `/achievements` | GET | All achievements in the system |
| **Achievements** | `/achievements/me` | GET | Achievements earned by the authenticated user |
| **Shop** | `/shop/items` | GET | All shop items |
| **Shop** | `/shop/items/me` | GET | Items owned by the authenticated user |
| **Shop** | `/shop/wallet` | GET | Authenticated user's wallet balance |
| **Shop** | `/shop/equipped` | GET | Items the authenticated user has equipped |
| **Shop** | `/shop/equipped/:user_id` | GET | Items another user has equipped |
| **Shop** | `/shop/equipped` | PATCH | Equip or unequip an item |
| **Shop** | `/shop/purchase` | POST | Purchase a shop item |
| **Shop** | `/shop/powerups/me` | GET | Powerups owned by the authenticated user |
| **Shop** | `/shop/powerups/use` | POST | Use a powerup |

---

### 4.3 Error Contract

All errors return a JSON body of the form `{ "message": "<description>" }`. The status codes in use are:

| Status | Meaning |
|--------|---------|
| 400 | Invalid or missing request input |
| 401 | Missing, invalid, or expired token |
| 403 | Authenticated but not permitted |
| 404 | Resource not found |
| 409 | Conflict (for example a duplicate friend request) |
| 410 | Resource expired or no longer available (for example an expired invite) |
| 500 | Unexpected server error; the message is always generic |

**Known inconsistency:** `GET /user/search` returns its 400 as `{ "error": "..." }` instead of `{ "message": "..." }`.

---

### 4.4 WebSocket Contract

WebSocket connection: `ws://localhost:3000` with `auth: { token: <JWT> }` in the handshake.

The server validates the JWT and attaches `socket.data.user_id` and `socket.data.username` before allowing connection. Note that `socket.data.user_id` is the **database** user id, while the frontend `userId` from Amplify is the **Cognito sub**. They are different values.

**Matchmaking events:**

| Event (emit) | Payload | Description |
|-------------|---------|-------------|
| `join_match_queue` | `{ elo, game_mode, game_type, username }` | Join the ranked matchmaking queue |
| `leave_match_queue` | — | Leave the matchmaking queue |
| `match_accepted` | `{ pair_id, game_mode, game_type, league, username, avatar }` | Accept a matched opponent |
| `match_declined` | `pair_id` | Decline a matched opponent |

| Event (on) | Payload | Description |
|-----------|---------|-------------|
| `users_matched` | `{ pair_id, players, game_mode }` | Opponent found |
| `user_dequeued` | — | Successfully left the queue |
| `dequeue-failed` | — | Failed to leave the queue |

**Game events:**

| Event (emit) | Payload | Description |
|-------------|---------|-------------|
| `send_questions` | `game_id` | Request questions for the match |
| `send_players` | `game_id` | Request player data for the match |
| `submit_question` | `{ game_id, question_id, answer, language? }` | Submit an answer |
| `question_started` | `{ game_id, question_id, started_at }` | Record when a player starts a question |
| `game_done` | `(game_id, game_type, pair_id)` | Signal match completion |
| `send_results` | `(game_id, pair_id)` | Request match results |
| `clean_up` | `(game_id, pair_id)` | Clean up match state from memory |

| Event (on) | Payload | Description |
|-----------|---------|-------------|
| `start_game` | `{ game_id }` | Both players accepted; match starting |
| `get_questions` | `GameQuestionsDTO` | Questions for the match |
| `get_players` | `PlayerDTO[]` | Player data for the match |
| `opponent_progress` | `{ correct: boolean }` | Opponent answered a question |
| `game_results` | `MatchResultDTO` | Final match results |

**Social events:**

| Event (emit) | Payload | Description |
|-------------|---------|-------------|
| `send_friend_invite` | `{ receiver_id, invite_code, sender_name, expires_at }` | Send a casual game invite to a friend |
| `friend_request_sent` |  | Notify the receiver of a new friend request |
| `friend_request_respond` |  | Accept or decline a friend request in real time |

| Event (on) | Payload | Description |
|-----------|---------|-------------|
| `friend_invite_received` | `{ invite_id, sender_name, expires_at }` | Incoming casual game invite |
| `friend_invite_responded` | <!-- CONFIRM --> | Friend invite responded to |
| `friend_request_responded` | `{from_user_id, from_username, status}` | Friend request responded to |
| `friend_request_received` | `{from_user_id, from_username}` | Friend request received |


---

## 5. Mapping Quality Requirements to Architectural Decisions

| Quality Requirement | Architectural Decision |
|---------------------|------------------------|
| **Performance:** Code execution results returned within 10 seconds; 100 concurrent matches without degradation | Code execution is decoupled into a separate Judge0 service so CPU-heavy submissions never block the primary application server. Real-time match state is pushed via WebSocket rather than polled via REST, eliminating per-tick HTTP overhead. Live match state is held in the ECS in-memory world, enabling zero-latency reads during gameplay without hitting the database. |
| **Reliability:** WebSocket disconnections preserve match state for 60 seconds; execution service failure does not crash the backend | Judge0 runs as an isolated, independently-failing service. Match state persists in Redis independently of the live socket connection, allowing reconnection within the 60-second window without data loss. The centralised error handler converts unexpected failures into a generic 500 response instead of crashing the request pipeline. |
| **Security:** Passwords salted via Cognito; TLS in transit; sandboxed execution; rate-limited auth | Authentication is fully offloaded to AWS Cognito. User-submitted code executes exclusively inside the Judge0 sandbox with enforced CPU/memory limits and no network access. All public traffic is served over HTTPS. JWT tokens are short-lived and validated on every protected request via `requireAuth` middleware. User identity is derived from the verified JWT — never from request parameters. Non-`HttpError` failures return a generic message so internal details are not exposed. |
| **Scalability:** Matchmaking scales horizontally; execution service scales independently | The matchmaking queue is backed by Redis and decoupled from the HTTP/WebSocket server, allowing the queue processor to scale independently. Judge0 is a separately containerised service that can be horizontally scaled without touching the main backend or database. |
| **Maintainability:** 80% unit test coverage; ESLint; no hardcoded config | Clean Architecture layering isolates business logic from transport and persistence concerns, enabling isolated unit testing per layer via mocked repository interfaces. Environment-specific configuration is externalised via `.env` files. ESLint enforces consistent standards across the monorepo. The curried controller pattern enables dependency injection without a DI framework, and centralised error handling keeps controllers free of repeated response formatting. |

---

## 6. NFR Traceability Matrix

Every quality requirement maps to at least one architectural tactic and one executable test. Tests live in `tests/nfr/` and run against a dedicated test stack (see below).

| Quality Requirement | Architectural Tactic | Test | Evidence |
|---------------------|----------------------|------|----------|
| **Performance:** p95 response time < 500ms under 100 concurrent users | ECS in-memory state; WebSocket push over REST poll; Redis-backed queue | k6 load test — 100 VUs, ramp up 30s, hold 4m, ramp down 30s, against the test backend on port 3001 (`tests/nfr/performance/load-test.js`) | k6 summary: p95 latency, error rate: in test suite |
| **Reliability:** Backend survives Judge0 failure | Judge0 decoupled as independently-failing container | Kill the running Judge0 container mid-submission; assert `/health` returns 200 (`tests/nfr/reliability/kill-judge0.sh`) | Terminal output showing backend alive after Judge0 killed |
| **Reliability:** Backend recovers after a 30s network disconnection | Match state held in Redis independently of the socket; stateless HTTP layer | Drop backend from the Docker network for 30s; reconnect; assert the backend recovers and `/health` returns 200 (`tests/nfr/reliability/websocket-disconnect.sh`) | Backend recovery log; socket reconnect in browser DevTools |
| **Security:** Unauthenticated requests rejected | JWT validation on all protected endpoints via `requireAuth` middleware | curl requests without a token and with an expired token (`tests/nfr/security/auth-test.sh`) | HTTP 401 responses for unauthenticated requests |
| **Security:** Malformed and tampered tokens rejected | Cognito JWT verification on every protected request | `jwt_tool` forced-error scan against protected endpoints | Scan output: all responses 401 |
| **Scalability:** Matchmaking queue handles concurrent players | Redis-backed queue decoupled from HTTP server | Flood the matchmaking queue with concurrent join requests (`tests/nfr/scalability/queue-stress.sh`) | Backend health check passing under load |
| **Maintainability:** ≥80% unit test coverage on core business logic | Layered Clean Architecture; mocked repository interfaces; Vitest | `npx vitest run --coverage` in `backend/` | Coverage report: statement and branch % |

**Test stack:** NFR tests run against `docker-compose.test.yml` (Compose project `codeclash-test`), which exposes the backend on port 3001, PostgreSQL on 5434, and Redis on 6380, all on the `pgnetwork` network. This keeps NFR runs isolated from the development stack.

---

## 7. Deployment

### 7.1 Deployment Requirements

| Requirement | Implementation |
|-------------|----------------|
| **Live, Accessible System** | The frontend (Nginx) and backend are deployed to AWS and reachable by public URL. URLs are documented in the project README. |
| **Environment Parity** | Three environments: `development` (local Docker Compose with hot-reload), `test` (isolated NFR stack), and `production` (Docker images deployed to AWS). |
| **Infrastructure as Code** | The local stack is defined in `docker-compose.yml`, and the NFR stack in `docker-compose.test.yml`. The production Dockerfiles (`backend/Dockerfile`, `frontend/Dockerfile`) define the deployed images. |
| **Secrets Management** | No credentials committed to source. `.env` files are gitignored locally. Environment variables are injected at deploy time. `.env.example` documents all required variables for new developers. |
| **Rollback Strategy** | Each deployment uses a built container image. A failed deployment is rolled back by redeploying the previously known-good image. Locally, rolling back means checking out the previous commit and running `docker-compose up --build`. EC2 images that get deployed. |

---

### 7.2 Environments

| Environment | Infrastructure | Trigger |
|-------------|---------------|---------|
| **Development** | Local Docker Compose — backend (ts-node dev), PostgreSQL, Redis, pgAdmin | `docker-compose up` (manual) |
| **Test (NFR)** | `docker-compose.test.yml` — project `codeclash-test`; backend :3001, PostgreSQL :5434, Redis :6380; Judge0 container for the reliability test | Manual, before running `tests/nfr/` scripts |
| **Production** | AWS — compiled Node.js backend, PostgreSQL, Redis; frontend served via Nginx | Push to `main` (automatic deployment) |

---

### 7.3 Deployment Diagram

[Deployment Diagram](/docs/Demo_3/diagrams/deployment-diagram.png)

**Communication paths:**

| From | To | Protocol | Port |
|------|----|----------|------|
| User browser | Nginx (frontend) | HTTPS | 443 |
| User browser | Backend service | HTTPS / WSS | 443 |
| Backend | PostgreSQL | PostgreSQL wire | 5432 |
| Backend | Redis | Redis protocol | 6379 |
| Backend | AWS Cognito | HTTPS | 443 |
| Backend | Judge0 | HTTP | 2358 *(only once Judge0 is wired into the submission flow, planned for Demo 4)* |

---

### 7.4 CI/CD Pipeline

The pipeline is defined in `.github/workflows/ci.yml` and runs on GitHub Actions on every pull request into `dev` and `main`.

```
Trigger: Pull request opened or updated targeting dev or main
│
├── Stage 1: Install
│     npm ci (backend + frontend)
│
├── Stage 2: Lint
│     ESLint across monorepo
│     Failure → PR blocked
│
├── Stage 3: Build
│     tsc (backend)  |  vite build (frontend)
│     Failure → PR blocked
│
├── Stage 4: Test
│     npx vitest run --coverage (backend unit tests only)
│     Failure → PR blocked
│
└── On merge to main:
      Production deployment to AWS runs automatically
      Rollback: redeploy the previous known-good image
```

**Manual approval gates:** Pull requests into `main` require at least 2 approving reviews from team members with write access. The last pusher cannot be one of the approvers. Enforced by GitHub branch protection rules.

[CI/CD Pipeline Diagram](/docs/Demo_3/diagrams/CI_CD_as_pe.pdf)
