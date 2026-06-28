CREATE TYPE problem_category AS ENUM ('math', 'programming');
CREATE TYPE difficulty_level AS ENUM('Easy','Medium','Difficult');
CREATE TYPE supported_languages AS ENUM('java','c++');
CREATE TYPE submission_type AS ENUM('math','programming');

CREATE TABLE IF NOT EXISTS users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS problems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type problem_category NOT NULL,
  difficulty_level difficulty_level NOT NULL,
  title VARCHAR(20) NOT NULL,
  description VARCHAR(40) NOT NULL,
  time_limit TIME(2) NOT NULL
);

CREATE TABLE IF NOT EXISTS match_problems(
  match_problems_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question1 UUID REFERENCES problems(id) NOT NULL,
  question2 UUID REFERENCES problems(id) NOT NULL,
  question3 UUID REFERENCES problems(id) NOT NULL, --every match has a minimum of 3 questions, i.e. difficult mode
  question4 UUID REFERENCES problems(id),
  question5 UUID REFERENCES problems(id)
);

CREATE TABLE IF NOT EXISTS matches(
  match_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player1_id UUID REFERENCES users(user_id),
  player2_id UUID REFERENCES users(user_id),
  match_problems_id UUID REFERENCES match_problems(match_problems_id),
  mode VARCHAR(10) CHECK (mode IN ('ranked', 'casual')) NOT NULL,
  queue_start TIMESTAMP DEFAULT NOW() NOT NULL,
  match_start TIMESTAMP,
  status VARCHAR(20) CHECK (status IN ('waiting', 'starting','in_progress', 'completed', 'abandoned')) DEFAULT 'waiting' --TODO check is there a function to set a found match status to starting?
);

CREATE TABLE IF NOT EXISTS match_log(
  log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID REFERENCES matches(match_id),
  winner_id UUID REFERENCES users(user_id),
  loser_id UUID REFERENCES users(user_id),
  elo_gained INTEGER, --can be null incase it's a casual match
  elo_lost INTEGER
);

CREATE TABLE IF NOT EXISTS elo_ratings (
  elo_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(user_id),
  rating INTEGER DEFAULT 600,
  updated_at TIMESTAMP DEFAULT NOW()
 
);


CREATE TABLE IF NOT EXISTS math_problems (
  id SERIAL PRIMARY KEY,
  problem_id UUID NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  --equation VARCHAR(20) NOT NULL,
  solution_formula VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS programming_problems (
  id SERIAL PRIMARY KEY,
  problem_id UUID NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  --function_signature VARCHAR(25) NOT NULL,
  supported_languages supported_languages NOT NULL
);

CREATE TABLE IF NOT EXISTS elo_history (
  history_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(user_id),
  match_id UUID REFERENCES matches(match_id),
  old_rating INTEGER,
  new_rating INTEGER,
  changed_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS achievements (
  achievement_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  achievement_name VARCHAR(30) NOT NULL,
  description VARCHAR(70) NOT NULL
);

--virtual table for m to n players to achievements
CREATE TABLE IF NOT EXISTS player_achievements (
  user_id UUID REFERENCES users(user_id),
  achievement_id UUID REFERENCES achievements(achievement_id),
  PRIMARY KEY (user_id, achievement_id)
);

CREATE TYPE submission_results AS ENUM ('Pending', 'Correct', 'Incorrect', 'Error');

CREATE TABLE IF NOT EXISTS submissions (
  submission_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(user_id),
  match_id UUID REFERENCES matches(match_id),
  problem_id UUID REFERENCES problems(id),
  submission_type submission_type NOT NULL,
  -- programming fields
  code TEXT NOT NULL,
  language supported_languages,
  -- Maths fields
  answer TEXT,
  status submission_results DEFAULT 'Pending',
  submitted_at TIMESTAMP DEFAULT NOW(),
  -- enforcing programming fields cannot be null if thats the submission type
  CONSTRAINT programming_fields_reqiured CHECK(
    submission_type != 'programming' OR (code IS NOT NULL AND language IS NOT NULL)
  ),
  -- enforcing maths fields cannot be null if thats the submission type
  CONSTRAINT math_fields_reqiured CHECK(
    submission_type != 'math' OR answer IS NOT NULL
  )
);

CREATE TABLE IF NOT EXISTS execution_results (
  result_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID REFERENCES submissions(submission_id),
  passed_cases INTEGER,
  total_cases INTEGER,
  execution_time INTEGER, -- in milliseconds
  memory_used INTEGER,
  error_message TEXT -- will be null if successful
);

CREATE TABLE IF NOT EXISTS test_cases (
  testcase_is UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  problem_id UUID REFERENCES problem_id(id) ON DELETE CASCADE,
  input TEXT NOT NULL,
  expected_output TEXT NOT NULL
);

CREATE TYPE powerup_type AS ENUM ('add_time_opponent', 'reduce_type_self', 'add_bug_opponent'); --more could be added
-- manually add different levels of the same powerup ??
CREATE TABLE IF NOT EXISTS powerups (
  powerup_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type powerup_type NOT NULL,
  description VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS match_powerups (
  match_powerup_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID REFERENCES matches(match_id),
  user_id UUID REFERENCES users(user_id),
  powerup_id UUID REFERENCES power_ups(powerup_id),
  used_at TIMESTAMP DEFAULT NOW()
);

CREATE TYPE friendship_status AS ENUM ('pending', 'accepted', 'declined', 'blocked');

CREATE TABLE IF NOT EXISTS friendships (
 friendship_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 requester_id UUID REFERENCES users(user_id),
 receiver_id UUID REFERENCES users(user_id),
 status friendship_status DEFAULT 'pending',
 created_at TIMESTAMP DEFAULT NOW(),
 updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS friend_invites (
  invite_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id REFERENCES users(user_id),
  invite_code VARCHAR(50) UNIQUE NOT NULL.
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);