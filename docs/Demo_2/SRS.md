# Software Requirements Specification
## CodeClash

**Version:** 2.0

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [User Stories & User Characteristics](#2-user-stories--user-characteristics)
3. [Functional Requirements](#3-functional-requirements)
4. [Domain Model](#4-domain-model)
5. [Quality Requirements](#5-quality-requirements)

---

## 1. Introduction

### 1.1 Purpose

This document specifies the software requirements for **CodeClash**, a competitive 1v1 gaming platform where players solve mathematics and programming problems in real time. It is intended for developers, designers, and stakeholders involved in the design, development, and testing of the platform.

### 1.2 Scope

CodeClash enables registered users to compete in ranked and casual matches across two game modes: **Math Battles** and **Programming Battles**. The platform includes matchmaking, real-time gameplay, ELO-based ranking, an achievement system, player reporting, and a management interface for content and moderation.

### 1.3 Definitions

| Term | Definition |
| --- | --- |
| ELO | Numerical skill rating updated after each ranked match (standard Elo formula, K=32, starting value 600) |
| Ranked Match | A competitive match that affects both players' ELO ratings |
| Casual Match | A non-competitive match between friends; ELO is unaffected |
| Manager | An authorised user with administrative privileges over content and player management |
| Player | An authenticated registered user participating in games |
| Judge0 | Third-party code execution engine used to evaluate programming submissions |
| Sandbox | Isolated execution environment that prevents user code from affecting the host system |
| League | A named tier grouping players by ELO range (e.g. Bronze, Silver, Gold, Platinum, Diamond) |

#### Definition of Done

DOD is PR made, reviewed and the issue is moved to done in the project board.

### 1.4 References

- `DESIGN.md` — UI and visual design specifications
- `SAS.md` — Software Architecture Specification

---

## 2. User Stories & User Characteristics

### User Flow

<img width="548" height="124" alt="UserFlow_Diagram" src="https://github.com/user-attachments/assets/905f6109-9497-4405-b5f6-d6f677d94779" />

### 2.1 User Classes

| Role | Description |
| --- | --- |
| **Guest** | Unauthenticated visitor; may only access the Welcome, Sign In, and Sign Up pages |
| **User** | Authenticated account holder; can view their profile, match history, and leader boards |
| **Player** | A User actively participating in game sessions |
| **Manager** | Privileged user with access to question management, player moderation, and platform analytics |

### 2.2 User Stories

#### Intended Users

The intended users of CodeClash are any people hoping to improve their mathematical and/or programming skills by practising in competitive one-on-one matches in which these skills are tested against other players. Users can either opt to play games where their score is not impacted; these “Casual” games are intended more for users who want to focus on practising and building their skills and knowledge of the tested concepts. Otherwise, they can play “Ranked” games, which are intended for users who want to test their skills by putting their score on the line. We intend to cater to a large variety of users by allowing them to test their mathematical skills in topics taught from the beginning of primary school all the way to the end of high school and early university, which will diversify our user base and allow people of virtually any age to be able to play and participate. CodeClash additionally intends to cater to Users looking to improve their coding skills specifically in C++ and Java.

#### Players

1. As a user, I want to register an account so I can participate in either ranked or casual games and track my progress.
2. As a player, I want to select a game mode before I enter a match so I can play the type of game I want to.
3. As a player, I want to be matched with another player so I can play against them in a game.
4. As a player, I want to enter a ranked game so I can play to try gain ELO and to be able to compare my skill and my standing against my opponents and within my own game league.
5. As a player, I want to use a mathematical input keyboard during maths games so I can type equations quickly and accurately.
6. As a player, I want to use a code editor during coding games so I can write and submit solutions efficiently.
7. As a player, I want to invite friends to play in casual matches so I can play against someone I know and practice with a friend.
8. As a player, I want to view my ranking within my game league and ELO so I can track my progress over time.
9. As a player, I want to see a countdown timer during ranked games so I can manage my time as I answer questions.
10. As a player, I want to view the leaderboard for each game so I can review my performance and how my ELO changed.
11. As a player, I want to receive notifications when a match result is finalised so I can see the outcome without having to check manually.
12. As a player, I want to report a player I suspect is cheating so I can play fair games and support integrity of the ranked system.
13. As a player, I want to report an error in a question so mistakes can be corrected.
14. As a player, I want to view my game history so I can see how I played in past games and what the outcome was, in order to observe my strengths and weaknesses.

#### Managers

1. As a manager, I want to add new questions to the question pool so I can ensure the game remains varied and engaging.
2. As a manager, I want to remove questions so I can ensure outdated and invalid questions aren’t given to players.
3. As a manager, I want to edit existing questions so I can correct errors, improve wording or edit answers.
4. As a manager, I want to categorise questions so I can organise questions by topic and difficulty.
5. As a manager, I want to review game plays so I can audit player performance and behaviour.
6. As a manager, I want to adjust a player’s ELO so I can correct rank results in cases of confirmed cheating
7. As a manager, I want to manage player access so I can ban cheating players
8. As a manager, I want to view submitted player reports so I can assess the complaints and determine a course of action
9. As a manager, I want to view platform-wide statistics so I can monitor game engagement, detect problem areas and inform content decisions

---

### 2.3 Use Cases

#### User

#### Register an account

```
Actor: User
TUCBW: User accesses the registration page
TUCEW: User is successfully registered or cancels the registration
```

#### View profile information

```
Actor: User
TUCBW: User selects profile icon
TUCEW: Profile page loads and user can see their information
```

#### Edit profile information

```
Actor: User
TUCBW: User selects 'edit' button on profile page
TUCEW: User saves edits
```

#### View match history

```
Actor: User
TUCBW: User selects 'history' button on a game
TUCEW: User can see the game history
```

#### View leaderboard

```
Actor: User
TUCBW: User selects the leaderboard button
TUCEW: User can see the top 10 players globally, and may filter by league/planet
```

#### View game results

```
Actor: User
TUCBW: User selects the result button of a game
TUCEW: User can see the result for the matches of that game
```

#### View submitted report

```
Actor: User
TUCBW: User selects the report they want to view
TUCEW: User can see the details of the report
```

#### Review all submitted reports

```
Actor: User
TUCBW: User opens 'Reports page'
TUCEW: User can see all submitted reports
```

#### Player

#### View Elo and ranking

```
Actor: Player
TUCBW: Player selects 'Elo and ranking' on their profile
TUCEW: ELO and ranking page loads and player can see their information
```

#### Select game mode

```
Actor: Player
TUCBW: Selects a game to be played
TUCEW: Selects one of the game mode options
```

#### Enter ranked game

```
Actor: Player
TUCBW: Player selects a game to play
TUCEW: Player is matched with an opponent and the game begins
```

#### Submit solution

```
Actor: Player
TUCBW: Player begins typing their solution
TUCEW: Player clicks the 'submit' button
```

#### View programming solution output

```
Actor: Player
TUCBW: Player clicks the 'submit' button on their programming question
TUCEW: Player can view the output of test cases run with their solution
```

#### Invite friends

```
Actor: Player
TUCBW: Player selects friends to play a specific game
TUCEW: Player receives a notification that the selected friends have received their request
```

#### Create cheating report

```
Actor: Player
TUCBW: Player selects the 'create report' button on a game page
TUCEW: Player submits or cancels the report
```

#### Create question error report

```
Actor: Player
TUCBW: Player selects 'create report' button on question page
TUCEW: Player submits or cancels report
```

#### Edit report

```
Actor: Player
TUCBW: Player selects the 'edit' button on a report
TUCEW: Player saves or cancels changes
```

#### Delete report

```
Actor: Player
TUCBW: Player selects the 'delete' button on a report
TUCEW: Player confirms or cancels deletion
```

#### Create a cheating appeal

```
Actor: Player
TUCBW: Player selects 'appeal' on a cheating report
TUCEW: Player submits or cancels the appeal
```

#### Edit appeal

```
Actor: Player
TUCBW: Player selects the 'edit' button on an appeal
TUCEW: Player saves or cancels changes
```

#### Delete appeal

```
Actor: Player
TUCBW: Player selects the 'delete' button on an appeal
TUCEW: Player confirms or cancels deletion
```

#### Earn achievements

```
Actor: Player
TUCBW: Player completes games and meets achievement criteria
TUCEW: Player is notified of achievements earned
```

#### View achievements

```
Actor: Player
TUCBW: Player selects 'achievements' on their profile
TUCEW: Player can see their earned achievements
```

#### Manager

#### Create question

```
Actor: Manager
TUCBW: Manager selects 'create question' button on questions page
TUCEW: Manager saves or cancels the new question
```

#### View question

```
Actor: Manager
TUCBW: Manager selects a question to view
TUCEW: Manager can see the details of that question
```

#### Edit question

```
Actor: Manager
TUCBW: Manager selects question to edit
TUCEW: Manager saves or cancels the changes
```

#### Delete question

```
Actor: Manager
TUCBW: Manager selects question to delete
TUCEW: Manager confirms or cancels deletion
```

#### Categorise questions

```
Actor: Manager
TUCBW: Manager selects a game mode and difficulty for a question
TUCEW: Manager saves the changes to the question
```

#### Edit player Elo

```
Actor: Manager
TUCBW: Manager selects player whose Elo is to be edited
TUCEW: Manager saves or cancels changes to player Elo
```

#### Ban player

```
Actor: Manager
TUCBW: Manager selects player to be banned
TUCEW: Manager confirms or cancels banning
```

#### Unban player

```
Actor: Manager
TUCBW: Manager selects a banned player to be unbanned
TUCEW: Manager saves player state change
```

#### View game engagement

```
Actor: Manager
TUCBW: Manager selects the 'engagement' button on a game
TUCEW: Manager can see statistics for game engagement
```

### Use Case Diagram

<img width="530" height="388" alt="Use case diagrams" src="https://github.com/user-attachments/assets/55c51422-7cd8-4f6f-84cf-f7c00ffb0f33" />

---

## 3. Functional Requirements

### 3.1 User Management

Covers user registration, authentication, profile management, and friend invitations.

| ID | Functional Requirement |
| --- | --- |
| 3.1.1 | The system shall allow users to register with a username, email, and password. |
| 3.1.2 | The system shall authenticate users via secure login and maintain session state. |
| 3.1.3 | The system shall allow users to view and edit their profile information. |
| 3.1.4 | The system shall display a user's Elo rating per game mode on their profile. |
| 3.1.5 | The system shall send email invitations to unregistered friends who are invited to play casual games by registered users. |

---

### 3.2 User Game System

Covers a user's view of their own match history, game results, and leaderboards.

| ID | Functional Requirement |
| --- | --- |
| 3.2.1 | The system shall maintain a persistent match history for each user. |
| 3.2.2 | The system shall display a user's match history for all games they have played. |
| 3.2.3 | The system shall display a global leaderboard showing the top 10 players ranked by ELO across all game modes. |
| 3.2.4 | The system shall allow users to filter the leaderboard by league (planet tier). |
| 3.2.5 | The system shall determine and announce a winner upon round and game completion. |

---

### 3.3 Report System

Covers user-facing visibility of submitted reports.

| ID | Functional Requirement |
| --- | --- |
| 3.3.1 | The system shall allow users to view their own submitted reports. |
| 3.3.2 | The system shall allow users to review all submitted reports relevant to them. |

---

### 3.4 Game System

Covers matchmaking, match and round flow, real-time synchronisation, the mathematics battle mode, the programming battle mode, and the underlying code execution service.

| ID | Functional Requirement |
| --- | --- |
| 3.4.1 | The system shall allow users to select a mathematics or programming game mode to play in. |
| 3.4.2 | The system shall allow users to select other registered users, by username, to play in casual games. |
| 3.4.3 | The system shall place users into a matchmaking queue when they request a ranked match. |
| 3.4.4 | The system shall match players in ranked games based on their Elo rating. |
| 3.4.5 | The system shall notify users when a match is found. |
| 3.4.6 | The system shall remove a user from the queue if they disconnect or cancel. |
| 3.4.7 | The system shall create a match session linking exactly two users upon successful pairing. |
| 3.4.8 | The system shall synchronise match state, timers, and opponent progress between both clients in real time. |
| 3.4.9 | The system shall present problems to both users simultaneously at the start of each round. |
| 3.4.10 | The system shall enforce a countdown timer per round, visible to both players. |
| 3.4.11 | The system shall update both users' Elo ratings upon match conclusion. |
| 3.4.12 | The system shall provide a mathematical input keyboard for games in the mathematics mode. |
| 3.4.13 | The system shall accept and validate a user's numerical answer submission. |
| 3.4.14 | The system shall support difficulty levels ranging from basic arithmetic to complex calculus. |
| 3.4.15 | The system shall provide an in-game code editor for games in the programming mode. |
| 3.4.16 | The system shall present users with an algorithmic problem and function signature to implement. |
| 3.4.17 | The system shall allow users to select their preferred programming language. |
| 3.4.18 | The system shall submit user code to the execution service upon the user's request. |
| 3.4.19 | The system shall display compilation errors and failed test case details immediately upon execution. |
| 3.4.20 | The system shall allow users to view their programming solution output. |
| 3.4.21 | The system shall execute user-submitted code in an isolated, sandboxed environment. |
| 3.4.22 | The system shall enforce CPU time limits and memory quotas on all code executions. |
| 3.4.23 | The system shall disable network access within the execution sandbox. |
| 3.4.24 | The system shall run submitted code against a predefined test suite and return pass/fail results. |
| 3.4.25 | The system shall compare execution output against expected output to determine correctness. |

---

### 3.5 Player Report System

Covers creation and management of cheating and question error reports submitted by players.

| ID | Functional Requirement |
| --- | --- |
| 3.5.1 | The system shall allow players to report suspicious behaviour during and after games. |
| 3.5.2 | The system shall allow players to report errors in questions during and after games. |
| 3.5.3 | The system shall allow players to edit their submitted reports. |
| 3.5.4 | The system shall allow players to delete their submitted reports. |

---

### 3.6 Player Appeal System

Covers creation and management of cheating appeals submitted by players.

| ID | Functional Requirement |
| --- | --- |
| 3.6.1 | The system shall allow players accused of cheating to submit a cheating appeal. |
| 3.6.2 | The system shall allow players to edit their submitted appeals. |
| 3.6.3 | The system shall allow players to delete their submitted appeals. |

---

### 3.7 Player Achievement System

Covers milestone tracking, achievement unlocking, and achievement visibility for players.

| ID | Functional Requirement |
| --- | --- |
| 3.7.1 | The system shall track milestone conditions against a user's match history. |
| 3.7.2 | The system shall unlock and award achievements to users who meet defined milestone conditions. |
| 3.7.3 | The system shall allow players to search their achievements. |
| 3.7.4 | The system shall display a user's earned achievements on their profile. |

---

### 3.8 Question Management System *(Manager)*

Covers manager-level creation, editing, deletion, and categorisation of questions.

| ID | Functional Requirement |
| --- | --- |
| 3.8.1 | The system shall allow manager users to add new questions to the database. |
| 3.8.2 | The system shall allow manager users to view questions in the database. |
| 3.8.3 | The system shall allow manager users to edit questions in the database. |
| 3.8.4 | The system shall allow manager users to remove questions from the database. |
| 3.8.5 | The system shall categorise questions according to game mode and difficulty. |

---

### 3.9 Player Management System *(Manager)*

Covers manager-level control over player Elo and account standing.

| ID | Functional Requirement |
| --- | --- |
| 3.9.1 | The system shall allow authorised users to edit a player's Elo rating. |
| 3.9.2 | The system shall allow authorised users to ban players. |
| 3.9.3 | The system shall allow authorised users to unban players. |

---

### 3.10 Game System *(Manager)*

Covers manager-level visibility into platform statistics and game engagement data.

| ID | Functional Requirement |
| --- | --- |
| 3.10.1 | The system shall collect statistics on game engagement and question error report locality. |
| 3.10.2 | The system shall allow authorised users to view platform statistics. |

---

## 4. Domain Model

### Domain Model Diagram

[Domain Model](/docs/Demo_2/diagrams/Domain%20Model.pdf)

---

## 5. Quality Requirements

These are the target non-functional requirements the system must satisfy. For the architectural mechanisms that satisfy each, see the Software Architecture Specification (`SAS.md`).

### Performance

- Initial application shell loads within **3 seconds** on a standard broadband connection.
- Matchmaking pairs users within **30 seconds** under normal load.
- Code execution results are returned within **10 seconds** for standard submissions.
- The system supports at least **100 concurrent active matches** without response time degradation.
- All user actions receive visual feedback within **200 ms**.

### Reliability

- WebSocket disconnections are handled gracefully; match state is preserved for a reconnecting user for at least **60 seconds**.
- A failure in the code execution service shall not crash or affect the primary backend.
- System uptime shall be at least **99%** during active usage periods.
- All errors and exceptions are logged for debugging and monitoring.

### Security

- Passwords are stored as salted hashes via AWS Cognito.
- All data in transit is encrypted using TLS (HTTPS).
- JWT tokens expire after a defined period and require refresh.
- User-submitted code only executes inside an isolated sandbox with CPU caps, memory quotas, and no network access.
- All API endpoints enforce authentication and authorisation checks.
- Authentication endpoints implement rate limiting against brute-force attacks.

### Scalability

- The matchmaking service is designed to scale horizontally.
- The code execution service is decoupled from the primary backend to allow independent scaling.
- The database accommodates a growing user base and match history without structural changes.

### Usability

- The application is fully functional on the latest versions of Chrome, Firefox, Safari, and Edge.
- Error messages are clear, specific, and actionable.
- The code editor provides syntax highlighting and auto-indentation for all supported languages.
- The interface targets a **1440×1024 px** desktop viewport; the programming battle is optimised for desktop.
- WCAG AA colour contrast compliance throughout.

### Maintainability

- Consistent coding standards enforced by ESLint.
- Core business logic has a minimum of **80% unit test coverage**.
- Changes to one service do not require changes to others.
- All environment-specific configuration is managed through environment variables; nothing is hardcoded.

### Auditability

- Logs are maintained for all match outcomes, ELO changes, and user reports.
- Anti-cheat flags are logged with timestamps and associated user identifiers.