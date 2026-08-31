# NFR Test Suite — CodeClash

This directory contains the Non-Functional Requirement (NFR) tests for CodeClash. Each test is mapped to a quality requirement from the SRS and a corresponding architectural tactic from the SAS.

---

## Prerequisites

Before running any NFR tests, ensure the full stack is running:

```bash
docker-compose up
```

And the frontend is running in a separate terminal:

```bash
npm run frontend
```

Verify the backend is healthy:

```bash
curl http://localhost:3000/health
# Expected: {"status":"ok"}
```

---

## Traceability Matrix
### Update this if the default input in the table doesn't match what and how you're actually testing
| Quality Requirement | Architectural Tactic | Test | Script |
|---------------------|----------------------|------|--------|
| Performance: 100 concurrent matches without degradation | ECS in-memory state; WebSocket push over REST | Load test with k6 — 100 virtual users, 5 min | `performance/load-test.js` |
| Reliability: Backend survives Judge0 failure | Judge0 decoupled as independently-failing service | Kill Judge0 container mid-submission; assert backend health | `reliability/kill-judge0.sh` |
| Reliability: Match state survives 60s disconnect | Match state persisted in Redis independently of socket | Drop network for 30s; reconnect; assert state intact | `reliability/websocket-disconnect.sh` |
| Security: Unauthenticated requests rejected | JWT validation on all protected endpoints | curl requests without token, with expired token | `security/auth-test.sh` |
| Scalability: Matchmaking queue scales independently | Redis-backed queue decoupled from HTTP server | Flood matchmaking queue; measure pairing time | `scalability/queue-stress.sh` |
| Maintainability: ≥80% unit test coverage | Layered Clean Architecture; mocked repository interfaces | Vitest coverage report | `npm run test:coverage` (in `backend/`) |

---

## 1. Performance — `performance/`

### Tool

### What it tests
- 100 virtual users hitting match and elo endpoints simultaneously for 5 minutes
- p95 response time target: < 500ms
- Error rate target: < 1%

### How to run

### Expected output


### Evidence to collect
- Screenshot of k6 summary output
- Note p95 latency and error rate

---

## 2. Reliability — `reliability/`

### 2.1 Judge0 Failure (`kill-judge0.sh`)

#### What it tests
Kills the Judge0 container while the backend is running and verifies the backend continues to respond to health checks — proving Judge0 failure does not crash the primary server.

#### How to run
```bash
chmod +x tests/nfr/reliability/kill-judge0.sh
bash tests/nfr/reliability/kill-judge0.sh
```

#### Expected output
```
[1] Killing Judge0 container...
[2] Judge0 stopped.
[3] Checking backend health...
{"status":"ok"}
[✓] Backend is still running after Judge0 failure.
[4] Restarting Judge0...
[✓] Done.
```

#### Evidence to collect
- Terminal output showing `{"status":"ok"}` after Judge0 is killed
- `docker logs codeclash-backend-1` showing no crash

---

### 2.2 WebSocket Disconnect (`websocket-disconnect.sh`)

#### What it tests
Disconnects the backend from the Docker network for 30 seconds and reconnects it, simulating a network interruption. Verifies the backend recovers and Redis-persisted state is intact.

#### How to run
```bash
chmod +x tests/nfr/reliability/websocket-disconnect.sh
bash tests/nfr/reliability/websocket-disconnect.sh
```

#### Expected output
```
[1] Disconnecting backend from network...
[2] Waiting 30 seconds...
[3] Reconnecting backend...
[4] Checking backend health...
{"status":"ok"}
[✓] Backend recovered after network interruption.
```

#### Evidence to collect
- Terminal output showing recovery
- Browser console showing socket reconnect (check Network tab in DevTools)

---

## 3. Security — `security/`

### Tool


### What it tests
- Requests without a token return `401`
- Requests with an expired token return `401`
- Requests with a valid token return `200`

### How to run


#### Expected output


#### Evidence to collect

---

## 4. Scalability — `scalability/`

### What it tests
Floods the matchmaking queue with concurrent join requests and measures how long pairing takes as load increases — demonstrating the queue handles concurrent players without blocking the HTTP server.

### How to run

#### Expected output


#### Evidence to collect
- Terminal output showing backend health under load
- `docker logs codeclash-backend-1` showing queue processing without errors

---

## 5. Maintainability — Vitest Coverage

### What it tests
Runs the full unit test suite with coverage reporting. Target: ≥80% coverage on core business logic (services and repositories).

### How to run
`

### Expected output

### Evidence to collect
- Screenshot of coverage summary
- Note overall statement and branch coverage percentages

---

## Running All NFR Tests

To run all shell-based NFR tests in sequence:

```bash
bash tests/nfr/reliability/kill-judge0.sh
bash tests/nfr/reliability/websocket-disconnect.sh
# add the other test file directories
cd backend && npx vitest run --coverage
```

Collect the output of each as evidence for the Demo 3 NFR traceability matrix.