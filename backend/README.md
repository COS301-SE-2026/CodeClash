# CodeClash Backend

The backend service for CodeClash, a real-time competitive programming and mathematics platform. Built with Node.js and Express, it handles game logic, matchmaking, user management, and communicates with the PostgreSQL database and Judge0 code execution engine.

## Prerequisites

Make sure you have the following installed before running the backend:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Docker](https://www.docker.com/products/docker-desktop)
- [Docker Compose](https://docs.docker.com/compose/) (included with Docker Desktop)
- [Git](https://git-scm.com/)

## Environment Setup

1. Navigate to the root of the project (not the backend folder):
```bash
cd CodeClash
```

2. Copy the environment variables template:
```bash
cp .env.example .env
```

3. Open `.env` and fill in the required values:
```
PORT=3000
DATABASE_URL=postgresql://postgres:password@db:5432/codeclash
JWT_SECRET=your_jwt_secret_here //TODO update with actual jwt secret
JUDGE0_URL=http://localhost:2358
```

## Running with Docker (Recommended)

From the root of the project:

```bash
docker-compose up --build
```

This will spin up:
- The backend server on `http://localhost:3000`
- The PostgreSQL database on port `5432`

To run in the background:
```bash
docker-compose up -d
```

To stop all services:
```bash
docker-compose down
```

To stop and wipe the database volume (careful — this deletes all local data):
```bash
docker-compose down -v
```

## Running Locally (Without Docker)

If you prefer to run the backend directly without Docker:

1. Make sure you have a PostgreSQL instance running locally and update your `.env` accordingly.

2. Navigate to the backend folder:
```bash
cd backend
```

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:3000` with hot reloading enabled via nodemon.

## Verifying the Server is Running

Once running, visit:
```
http://localhost:3000/health
```

You should see:
```json
{ "status": "ok" }
```

## Running Tests

From the backend folder:
```bash
npm test
```

To run tests with coverage:
```bash
npm test -- --coverage
```

## PG-Admin

1. make sure the docker is running 
2. open: 
   ```
     http://localhost:5151
   ```
3. login using pgadmin email and password
4. right click on 'Servers" 
5. navigate to Register > Server 
6. in the 'General' tab 
    ```
    Name: postgres
    ```
7. in the 'Connection' tab 
    ```
    Host: db
    Maintenance database:  postgres db (from env)
    Username: postgres user (from env)
    Password: postgres password (from env)
    ``` 
8. 'Save'


## Project Structure

```
backend/
├── src/
│   ├── config/         # Database and environment configuration
│   ├── controllers/    # Route handler logic
│   ├── middleware/     # Authentication, error handling, validation
│   ├── models/         # Database models
│   ├── routes/         # API route definitions
│   ├── app.js       
│   └── server.js       # Entry point
├── tests/              # Jest test files
├── Dockerfile
├── package-lock.json
├── package.json
└── tsconfig.json
```

## API Documentation

All API endpoints are prefixed with `/api`. A full list of service contracts is available in the [SRS Document](../docs/SRS.pdf).

## Tech Stack

| Concern          | Technology    |
| ---------------- | ------------- |
| Runtime          | Node.js v18   |
| Framework        | Express       |
| Database         | PostgreSQL 15 |
| Code Execution   | Judge0        |
| Testing          | Jest          |
| Containerisation | Docker        |

## Common Issues

**Port already in use:**
```bash
# Find and kill the process using port 3000
lsof -i :3000
kill -9 <PID>
```

**Database connection refused:**
- Make sure Docker is running
- Make sure you ran `docker-compose up` from the root, not the backend folder
- Check your `DATABASE_URL` in `.env` matches the credentials in `docker-compose.yml`

**Changes not reflecting:**
- If running via Docker, rebuild the image:
```bash
docker-compose up --build
```
- If running locally, nodemon should auto-restart — check the terminal for errors