# Software Architecture Specification
## CodeClash
**Version:** 1.0

---

## Table of Contents
1. [Introduction](#1-introduction)
2. [Architectural Requirements](#2-architectural-requirements)
3. [Technology Requirements](#3-technology-requirements)
4. [API Contracts](#4-api-contracts)
5. [Mapping Quality Requirements to Architectural Decisions](#5-mapping-quality-requirements-to-architectural-decisions)
6. [Deployment](#6-deployment)

---

## 1. Introduction

### 1.1 Purpose
This document specifies the software architecture for **CodeClash**, a competitive 1v1 gaming platform where players solve mathematics and programming problems in real time. Where the Software Requirements Specification (SRS) defines *what* the system must do, this document defines *how* the system is structured to satisfy those requirements.

### 1.2 Scope
This document covers the architectural patterns, design patterns, constraints, technology decisions, API contracts, and deployment strategy for the CodeClash platform. It is intended for developers and stakeholders involved in the implementation, review, and evaluation of the system.

### 1.3 References
- `SRS.md` — Software Requirements Specification

---

## 2. Architectural Requirements

### 2.1 Architectural Patterns

#### Client-Server

The System as a whole uses a client server pattern. The frontend of the application acts as a client that connects to the backend, acting as a server, through Websockets and  API gateways.


#### Layered Pattern

The backend or the system is implemented with a layered architecture. The layers are design to follow CLEAN Architecture, which organizes the application into a set of layers each with clearly defined responsibilities. 

The most important feature of this pattern is its dependency rule. 

```
Dependencies can only point inwards.
```

This means only outer layers are allowed to know of the existence of inner layers. 
Application layer code , for example, cannot know of the existence of the frameworks used to implement the database. 

This allows separation of concern, flexibility and modularity. It means the database can be swapped out without having to change any code on the inner layers. 

##### Entity Layer
    the inner most layer of CLEAN Architecture encapsulates business rules. 
    Entities are designed to be used system wide in many different applications. 

    Entites are represented by database-entities, Entity Component System (ECS) entities and ECS components. 

##### Application Layer
    The application layer contains all application specific logic. It consist of application use cases and it exposes interfaces for the layer to folloe. 

    This layer encapsulates and implements the flow of data to and from entities. 
    Changes in this layer should not affect the entities. This layer is also isolated from exteranl database, ui or frameowkr changes. 
    
    Changes to application operations will affect application use cases, and will therefore affect this layer. 

##### Interface Adapters

    This layer is responsible for converting data from a format convenient for the usecase, to a format that can be used by external system such as the database or client. 

    This layer provides abstraction that prevents the Entity and Application layers from knowing anything about external systems. Such that those external systems can be changed without having to rewrite application code. 

##### Frameworks and Drivers 
    This is the outermost layer of the architectural pattern. 

    This is where all configuration of frameworks and wiring is kept. All the details of specific technologies and systems are kept here so the don't have an impact of the internal layers. 

#### Event Driven Architecture 

Time is a determining factor in who wins a match and who loses. Therefore, in the interest of speed, the game system of CodeClash is managed with websocket and redis caches. 

The server acts as the event bus for this architecture. It routes all messages from the frontend client to the use cases that execute and return responses back through the server. 

#### Model, View, View Model

The frontend of the application is represented by a presentation layer implemented with mvvm. 

Models describe how data will be structures, views simply display data to the client and view models encapsulate all business logic regarding populating the view. 

This includes API requests, Websocket event emmission and any calculations and transformations needed to present data to the client. 

| **Client-Side SPA** | The React frontend is a single-page application. Navigation between screens does not trigger full-page reloads; all routing is handled client-side via React Router. |

---

### 2.2 Design Patterns

| Pattern | Where Applied |
|---------|--------------|
| **Strategy Pattern** | ELO calculation and answer validation vary by game mode. Each mode encapsulates its own calculation strategy, making it possible to swap or extend game modes without modifying the core match service. |
| **Observer / Event Emitter** | Achievement unlocking listens for match completion events emitted by the match service. This decouples the achievement system from the match flow — the match service does not need to know achievements exist. |
| **Factory Pattern** | Problem creation selects between a `MathProblem` or `ProgrammingProblem` concrete type at runtime based on the `type` field, without the caller needing to know which concrete class is being instantiated. |
| **Repository Pattern** | All database access is abstracted behind repository interfaces (`IEloRepository`, `IMatchResultRepository`, `IUserRepository`). Services depend on the interface, not the implementation, making it straightforward to swap out the data source or mock repositories in tests. |
| **Data Transfer Object (DTO)** | Data crossing layer boundaries is encapsulated in strongly-typed DTOs (`MatchResultDTO`, `PlayerStatsDTO`, `EloUpdateResultDTO`). This prevents raw database entities from leaking into business logic or API responses. |

---

### 2.3 Constraints

| Constraint | Detail |
|------------|--------|
| **Desktop-first** | The programming battle UI is designed and tested for desktop viewports (1440×1024 px minimum). Mobile is out of scope for the current version. |
| **Two-player only** | Each match links exactly two players. Multiplayer lobbies are not supported. |
| **Ranked ELO is immutable by players** | Only Managers may manually adjust ELO. Automated updates occur only at match conclusion via the standard Elo formula (K=32, starting value 600). |
| **Code execution isolation** | User code must never execute outside of the Judge0 sandbox. Direct server-side execution is prohibited. |
| **Branch discipline** | The `main` branch must always reflect a deployable, working version of the system. All changes enter via pull request into `dev`, then are promoted to `main`. |
| **No hardcoded secrets** | All environment-specific configuration must use environment variables managed through `.env` files. Nothing is hardcoded in source. |
| **OAuth scope** | Google and Apple sign-in are wired as future placeholders and are not in scope for the current release. |
| **In-memory match state** | Live match data (ECS world, submissions, life totals) is held in application memory during a match and is not persisted to the database until match conclusion. This means match state is lost if the backend restarts mid-game. |

---

### 2.4 Architectural Diagram

[Diagram](/docs/Demo_2/diagrams/Architecture%20Diagram.drawio.pdf)

The diagram above shows the technology-neutral logical structure of the system. For the physical deployment topology, see Section 6.

---

## 3. Technology Requirements

### 3.1 Frontend

| Concern | Technology | Justification |
|---------|-----------|---------------|
| Framework | React (SPA) | Component-based architecture suits the real-time, state-heavy game UI; large ecosystem and team familiarity. |
| Language | TypeScript | Static typing catches interface mismatches between frontend and backend DTOs at compile time. |
| Bundler | Vite | Fast HMR for development; optimised production builds with code splitting. |
| Styling | CSS + Tailwind CSS | Utility-first classes accelerate UI development; design tokens defined in our BSG ensure visual consistency. |
| Real-time | Socket.IO client | Matches the Socket.IO server used on the backend; handles reconnection and fallback automatically. |
| Code editor | Embedded editor component | Provides syntax highlighting and auto-indentation for supported programming languages within the browser. |
| Math input | Custom MathLive keyboard component | MathLive renders LaTeX in real time, giving players an accurate mathematical input experience without requiring LaTeX knowledge. |
| Authentication | AWS Amplify / Cognito | Integrates with the Cognito user pool used on the backend; handles token refresh and session persistence. |
| Browser support | Chrome, Firefox, Safari, Edge (latest) | Targets the broadest desktop audience without requiring legacy polyfills. |

---

### 3.2 Backend

| Concern | Technology | Justification |
|---------|-----------|---------------|
| Runtime | Node.js (v22) | Event-loop model handles many concurrent WebSocket connections efficiently without thread-per-connection overhead. |
| Framework | Express | Minimal, well-understood HTTP framework; integrates cleanly with Socket.IO and existing middleware ecosystem. |
| Language | TypeScript | Enables strict typing across layer boundaries; DTOs and interfaces are enforced at compile time. |
| ORM | TypeORM | Decorators-based entity definition aligns with the Clean Architecture entity layer; supports migrations. |
| Authentication | AWS Cognito | Offloads credential storage, password hashing, JWT issuance, and token refresh to a managed service, eliminating a common attack surface. |
| Real-time | Socket.IO (server) | Handles WebSocket upgrade, rooms, namespaces, and reconnection logic; emits match events to individual player rooms. |
| In-memory state | Custom ECS (World) | Lightweight entity-component system holds live match state in application memory for zero-latency reads during gameplay. |
| Queue | Redis | Persistent, fast in-memory store for the matchmaking queue and match state backup; survives socket disconnects. |
| API style | REST + WebSocket | REST for stateless CRUD operations (profile, history, leaderboard); WebSocket for stateful real-time match events. |

---

### 3.3 Code Execution

| Concern | Technology | Justification |
|---------|-----------|---------------|
| Execution engine | Judge0 (external service) | Battle-tested sandbox used by competitive programming platforms; supports multiple languages and enforces resource limits without custom sandbox development. |
| Isolation | Sandboxed container | CPU time limits, memory quotas, and network isolation are enforced at the container level, preventing runaway or malicious submissions from affecting other services. |
| Test environment | Mock Judge0 | Unit and integration tests use a mock implementation to avoid network dependencies and ensure deterministic results. |

---

### 3.4 Data

| Concern | Technology | Justification |
|---------|-----------|---------------|
| Database | PostgreSQL 15 | Relational model suits the structured, relational nature of users, matches, submissions, and ELO history; ACID guarantees protect match result integrity. |
| Cache / Queue | Redis | Sub-millisecond read/write for the matchmaking queue and ephemeral session data; persistence mode (`appendonly yes`) guards against data loss on restart. |
| Primary keys | UUID | Prevents enumeration attacks and decouples ID generation from the database sequence. |
| Data format | JSON over REST | Standard, human-readable, and natively supported by Node.js and PostgreSQL's `jsonb` type. |

---

### 3.5 DevOps & Tooling

| Concern | Technology | Justification |
|---------|-----------|---------------|
| Containerisation | Docker + Docker Compose | Single-command local environment (`docker-compose up`) reproducible across all developer machines. |
| Cloud deployment | Railway | Git-connected auto-deploy on push to `main`; native support for Dockerised services, managed PostgreSQL add-on, and environment variable injection. |
| CI/CD | GitHub Actions | Runs lint, build, and test on every pull request into `dev` and `main`; blocks merge if checks fail. |
| Linting | ESLint | Enforces consistent code style across the monorepo; catches common TypeScript errors not caught by the compiler. |
| Testing | Vitest | Fast, native ESM support; compatible with TypeScript without additional transformation config. Minimum 80% coverage on core business logic. |
| Secret management | `.env` + `.env.example` | Secrets never committed to source; `.env.example` documents required variables for new developers. |

---

## 4. API Contracts

Unfortunately our previous API contract doc is too out of date to comfortably include officially in our documentation. 

> **Note:** Swagger/OpenAPI auto-generation via `swagger-jsdoc` was implemented in the codebase but could not be fully integrated into the running server in time for Demo 2.

---

## 5. Mapping Quality Requirements to Architectural Decisions

| Quality Requirement | Architectural Decision |
|---------------------|------------------------|
| **Performance:** Code execution results returned within 10 seconds; 100 concurrent matches without degradation | Code execution is decoupled into a separate Judge0 service so CPU-heavy submissions never block the primary application server. Real-time match state is pushed via WebSocket rather than polled via REST, eliminating per-tick HTTP overhead. Live match state is held in the ECS in-memory world, enabling zero-latency reads during gameplay without hitting the database. |
| **Reliability:** WebSocket disconnections preserve match state for 60 seconds; execution service failure does not crash the backend | Judge0 runs as an isolated, independently-failing service: a crash or infinite loop in user code cannot propagate to the Node.js application server. Match state persists in Redis independently of the live socket connection, allowing reconnection within the 60-second window without data loss. |
| **Security:** Passwords salted via Cognito; TLS in transit; sandboxed execution; rate-limited auth | Authentication is fully offloaded to AWS Cognito rather than implemented with custom credential handling, eliminating a common attack surface. User-submitted code executes exclusively inside the Judge0 sandbox with enforced CPU/memory limits and no network access. All public traffic is served over HTTPS. JWT tokens are short-lived and validated on every protected request. |
| **Scalability:** Matchmaking scales horizontally; execution service scales independently | The matchmaking queue is backed by Redis and decoupled from the HTTP/WebSocket server, allowing the queue processor to scale independently. Judge0 is a separately containerised service that can be horizontally scaled without touching the main backend or database. The layered architecture ensures no service is tightly coupled to another's scaling behaviour. |
| **Maintainability:** 80% unit test coverage; ESLint; no hardcoded config | The Clean Architecture layering (frameworks → interface adapters → use cases → entities) isolates business logic from transport and persistence concerns, enabling isolated unit testing per layer via mocked repository interfaces. Environment-specific configuration is externalised via `.env` files, never hardcoded. ESLint enforces consistent standards across the monorepo. |

---

## 6. Deployment

### 6.1 Deployment Requirements

| Requirement | Implementation |
|-------------|----------------|
| **Live, Accessible System** | The backend is deployed on Railway and reachable at the URL provided in the README and demo slides. |
| **Environment Parity** | Three environments are maintained: `development` (local Docker Compose), `staging` (Railway preview deployments on PRs), and `production` (Railway production linked to `main`). |
| **Infrastructure as Code** | The full local stack is defined in `docker-compose.yml` (backend, PostgreSQL, Redis, pgAdmin). Railway deployments use the backend `Dockerfile` and environment variables injected via the Railway dashboard. |
| **Secrets Management** | No credentials are committed to the repository. Environment variables are managed via `.env` locally (gitignored) and via Railway's environment variable injection in production. An `.env.example` documents all required variables. |
| **Rollback Strategy** | Railway maintains a deployment history with pinned image tags. A failed deployment is rolled back by selecting the previous successful deployment in the Railway dashboard and triggering a redeploy. Locally, rolling back is achieved by checking out the previous tag and running `docker-compose up --build`. |

---

### 6.2 Environments

| Environment | Infrastructure | Trigger |
|-------------|---------------|---------|
| **Development** | Local Docker Compose (`docker-compose up`) | Manual |
| **Production** | Railway (backend + PostgreSQL add-on + Redis add-on) | Push to `main` |

---

### 6.3 Deployment Diagram

> The following describes the production deployment topology. 

[Deployment Diagram](/docs/Demo_2/diagrams/deployment-diagram.pdf)

**Communication paths:**

| From | To | Protocol | Port |
|------|----|----------|------|
| User browser | Railway edge | HTTPS | 443 |
| Railway edge | Backend service | HTTP | 3000 |
| User browser | Backend service | WebSocket (WSS) | 443 |
| Backend | PostgreSQL | PostgreSQL wire | 5432 |
| Backend | Redis | Redis protocol | 6379 |
| Backend | AWS Cognito | HTTPS | 443 |
| Backend | Judge0 | HTTPS | 443 |

---

### 6.4 CI/CD Pipeline

The pipeline is defined in `.github/workflows/ci.yml` and runs on GitHub Actions.

[CI CD Pipeline Diagram](/docs/Demo_2/diagrams/CI_CD_as_pe.pdf)

**Manual approval gates:** Pull requests into `main` require at least 2 approving reviews from team members with write access before merge is permitted, enforced by GitHub branch protection rules.
