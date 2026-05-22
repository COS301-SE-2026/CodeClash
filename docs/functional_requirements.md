# User Management

The system shall allow users to register with a username, email and password

The system shall authenticate users via secure login and maintain session state

The system shall allow users to vew and edit their profile information

The system shall display a user's Elo rating per game mode on their profile

The system shall maintain a persistent match history for each user 

The system shall allow users to select other registers users, with their usernames, to play in casual games

The system shall send email requests to unregistered friends that are invited, to play casual games, by registered users

The system shall diplay users match history for all games they have played

The system shall allow authorised users to edit other players Elo 

The system shall allow authorised uers to ban other players

# Matchmaking

The system shall allow users to select a mathematics or programming game mode to play in

The system shall place users into a matchmaking queue when they request a match
 
The system shall match players in ranked games based on their Elo

The system shall notify users when a match is found

The system shall remove a user from the queue if they disconnect or cancel 

# Match & Game Flow 

The system shall create a match session linking exactly two users upon successful pairing

The system shall synchronise match state, timers and opponents progress between both clients in real time 

The system shall present problems to both users simulateneously at the start of each round

The system shall enforce a countdown timer per round, visible to both players

The system shall determine and announce a winner upon round and game completion

The system shall update both users' Elo ratings upon match conclusion

The system shall store and display the top 5 players of each game 


# Math Battles

The system shall provide a mathematical input keyboard for games in the maths mode

The system shall accept and validate a user's numerical answer submission

The system shall support difficult levels ranging from basic arithmetic to comples calculus


# Programming Battles

The system shall provide an in-game code editor for games in the programming mode

The system shall present users with an algorithmic problem and function signature to implement

The system shall allow users to select their preferred programming language

The system shall sumbit user code to the execution service upon the users' request

The system shall display compilation errors and failed test case details immediately upon execution

# Code Execution 

The system shall execute user-submitted code in an isolated, sandbox evironment

The system shall enforce CPU time limits and memory quotas on all code executions 

The system shall disable network access within the execution sandbox 

The system shall run submitted code against a predefined test suite and return pass/fail results  

The system shall compare execution output against expected output to determine correctness 

# Achievements

The system shall track milestone conditions against a user's match history  

The system shall unlock and award achievements to users who meet defined milestone conditions  

The system shall display a user's earned achievements on their profile  

# Reporting 

The system shall allow players to report suspicious behvaiour during and after games

The system shall allow players to report errors in questions during and after games

The system shall allow players accused of cheating to submit appeals 

The system shall display all submitted reports and appeals for manager users

# System Management

The system shall allow manager users to add new questions to the database

The system shall allow manager users to remove questions from the database

The system shall allow manager users to edit questions in the database

The system shall categorise questions according to game mode and difficulty

The system shall collect statistics on game engagement and error report locality

The system shall allow authorised users to view platform statistics


