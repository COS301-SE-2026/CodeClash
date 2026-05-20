# Non-Functional Requirements
### CodeClash

## Performance
-	The system shall load the initial application shell within 3 seconds on a standard broadband connection
-	The matchmaking system shall pair users within 30 seconds under normal load conditions
-	Code execution results shall be returned to the user within 10 seconds for standard submissions
-	The system shall support at least 100 concurrent active matches without degradation in response time

## Scalability
-	The matchmaking service shall be designed to scale horizontally to accommodate a growing user base
-	The code execution service shall be decoupled from the primary backend to allow independent scaling under high submission load
-	The database shall be designed to handle a growing match history and user base without requiring structural changes

## Security
-	All user passwords shall be stored as salted hashes using the latest industry standard on Cognito.
-	All data in transit shall be encrypted using TLS (https:// instead of http).
-	JWT tokens shall expire after a defined period and require refresh
-	User-submitted code shall never be executed outside of an isolated sandboxed environment
-	The execution sandbox shall enforce strict CPU time caps, memory quotas, (and string cap?)[pencilled in] and network access disablement
-	All API endpoints shall enforce authentication and authorisation checks before processing requests
-	The system shall implement rate limiting on authentication endpoints to prevent brute force attacks

## Reliability
-	The system shall handle WebSocket disconnections gracefully, preserving match state for a reconnecting user for at least 60 seconds
-	A failure in the code execution service shall not crash or affect the primary backend server
-	The system shall have an uptime of at least 99% during active usage periods
-	The system shall log all errors and exceptions to enable debugging and monitoring

## Usability
-	The application shall be fully functional on the latest versions of Chrome, Firefox, Safari, and Edge
-	The interface shall provide immediate visual feedback for all user actions within 200ms
-	Error messages shall be clear, specific, and actionable rather than generic
-	The code editor shall provide syntax highlighting and auto-indentation for all supported languages
-	The application shall be responsive across desktop screen sizes, with the programming battle interface optimised primarily for desktop

## Maintainability
-	The codebase shall follow consistent coding standards enforced by ESLint
-	All core business logic shall have a minimum of 80% unit test coverage
-	The system shall follow a modular architecture, ensuring that changes to one service do not require changes to others
-	All environment-specific configuration shall be managed through environment variables and never hardcoded

## Testability
-	All core services shall have unit tests written in Jest
-	Critical user flows shall be covered by integration tests
-	The code execution service shall have test cases covering edge cases including infinite loops, memory overflows, and malformed or malicious input
-	The system shall support mock implementations of the Judge0 service for testing purposes without requiring a live execution environment

## Deployability
-   The entire system shall be deployable using a single docker-compose up command in a development environment
-   The backend and code execution engine shall be containerised using Docker
-	The system shall be deployed to a publicly accessible cloud environment before each demo
-	The main branch shall always reflect a working deployable version of the system

## Auditability
-	The system shall maintain logs of all match outcomes, Elo changes, and user reports
-	All anti-cheat flags shall be logged with timestamps and associated user identifiers for review

