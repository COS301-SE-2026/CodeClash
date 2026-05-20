--very generic tables that can be changed later, just trying not to keep the file empty

CREATE TYPE problem_category AS ENUM ('math', 'programming');
CREATE TYPE difficulty_level AS ENUM('Easy','Medium','Difficult');
CREATE TYPE supported_languages AS ENUM('java','c++');

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