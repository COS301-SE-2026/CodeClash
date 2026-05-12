--very generic tables that can be changed later, just trying not to keep the file empty
CREATE TABLE IF NOT EXISTS users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS match_problems(
  match_problems_id PRIMARY KEY DEFAULT gen_random_uuid(),
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
  status VARCHAR(20) CHECK (status IN ('waiting', 'in_progress', 'completed', 'abandoned')) DEFAULT 'waiting'
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

CREATE TABLE IF NOT EXISTS elo_history (
  history_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(user_id),
  match_id UUID REFERENCES matches(match_id),
  old_rating INTEGER,
  new_rating INTEGER,
  changed_at TIMESTAMP DEFAULT NOW()
);