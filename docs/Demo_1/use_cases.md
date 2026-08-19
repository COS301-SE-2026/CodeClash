# User

Register an account
    Actor: User
    TUCBW: User accesses the registration page
    TUCEW: User is successfully registered or cancels the registration

Vew profile information
    Actor: User
    TUCBW: User selects profile icon
    TUCEW: profile page loads and users can see their information

Edit profile information
    Actor: User
    TUCBW: User selects 'edit' button on profile page
    TUCEW: User saves edits

View match history
    Actor: User
    TUCBW: User selects 'history' button on a game 
    TUCEW: User can see the game history 

View game leaderboard
    Actor: User
    TUCBW: User selects the leaderboard button on a game
    TUCEW: User can see the top 5 players of that game

View game results
    Actor: User
    TUCBW: User selects the result button of a game
    TUCEW: User can see the result for the matches of that game

Vew submitted report 
    Actor: User
    TUCBW: User selects the report they want to view
    TUCEW: User can see the details of the report

Review all submitted reports
    Actor: User
    TUCBW: User opens 'Reports page'
    TUCEW: User can see all submitted reports

# Player

View Elo and ranking
    Actor: Player
    TUCBW: Player selects 'Elo and ranking' on their profile
    TUCEW: ELo and ranking page loads and player can see their information

Select game mode
    Actor: Player
    TUCBW: Selects a game to be played
    TUCEW: Selects one of the game mode options

Enter ranked game
    Actor: Player
    TUCBW: player selects a game to play
    TUCEW: player is matched with an opponent and the game begins

Submit solution
    Actor: Player
    TUCBW: player begins typing their solution
    TUCEW: player clicks the 'submit' button

View programming solution output
    Actor: Player
    TUCBW: Player clicks the 'submit' button on their programming question
    TUCEW: Player can veiw the output of test cases run with their solution

Invite friends
    Actor: Player 
    TUCBW: Player selects friends to play a specific game
    TUCEW: Player receives a notification that the selected friends have received their request

Create cheating report 
    Actor: Player
    TUCBW: Player selects the 'create report' button on a game page
    TUCEW: Player submits or cancels the report

Create question error report 
    Actor: Player
    TUCBW: Player selects 'create report' button on question page
    TUCEW: Player submits or cancel report

Edit report 
    Actor: Player 
    TUCBW: Player selects the 'edit' button on a report
    TUCEW: Player saves or cancels changes 

Delete report 
    Actor: Player
    TUCBW: Player selects the 'delete' button on a report
    TUCEW: Players confirms or cancels deletion

Create a cheating appeald
    Actor: Player
    TUCBW: Player selects 'appeal' on a cheating report
    TUCEW: Player submits or cancel the appeal

Edit appeal
    Actor: Player
    TUCBW: Player selects the 'edit' button on an appeal
    TUCEW: Player saves or cancels changes

Delete appeal
    Actor: Player
    TUCBW: Player selects the 'delete' button on an appeal
    TUCEW: Player confirms or cancels deletion

Earn achievements
    Actor: Player
    TUCBW: Player completes games and meets achievement criteria
    TUCEW: Player is notified of achievements earned

View achievements
    Actor: Player
    TUCBW: Player selects 'achievements' on their profile
    TUCEW: Players can see their earned achievements

# Manager

Create question
    Actor: Manager
    TUCBW: Manager selects 'create question' button on questions page
    TUCEW: Manager saves or cancels the new question

View question
    Actor: Manager
    TUCBW: Manager selects a question to view
    TUCEW: Manager can see the details of that question

Edit question
    Actor: Manager
    TUCBW: Manager selects question to edit
    TUCEW: Manager saves or cancels the changes

Delete question
    Actor: Manager
    TUCBW: Manager selects question to delete
    TUCEW: Manager confirms or cancels deletion

Categorise questions
    Actor: Manager
    TUCBW: Manager selects a game mode and difficulty for a question
    TUCEW: Manager saves the changes to the question

Edit player Elo
    Actor: Manager
    TUCBW: Manager selects player whose Elo is to be edited
    TUCEW: Manager saves or cancels changes to player Elo

Ban player
    Actor: Manager
    TUCBW: Manager selects player to be banned
    TUCEW: Manager confirms or cancels banning

Unban player
    Actor: Manager
    TUCBW: Manager selects a banned player to be unbanned
    TUCEW: Manager saves player state change

View game engagement 
    Actor: Manager
    TUCBW: Manager selects the 'engagement' button on a game
    TUCEW: Manager can see statistics for game engagement
