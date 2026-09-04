--very generic tables that can be changed later, just trying not to keep the file empty

CREATE TYPE GAME_MODES AS ENUM ('math', 'programming');
CREATE TYPE supported_languages AS ENUM('java','c++');

CREATE TABLE IF NOT EXISTS leagues(
  league_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  league_name TEXT  UNIQUE NOT NULL,
  elo_range int4range NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  avatar_id Integer,
  league VARCHAR(10) NOT NULL DEFAULT 'Mercury'
);

CREATE TABLE IF NOT EXISTS questions (
  question_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_mode GAME_MODES NOT NULL,
  difficulty INTEGER NOT NULL CHECK (difficulty >= 1 AND difficulty <= 24),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  time_limit TIME(2) NOT NULL
);

CREATE TABLE IF NOT EXISTS answers (
  answer_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID REFERENCES questions(question_id),
  answer TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS matches(
  match_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player1_id UUID REFERENCES users(user_id),
  player2_id UUID REFERENCES users(user_id),
  match_type VARCHAR(10) CHECK (match_type IN ('ranked', 'casual')) NOT NULL,
  game_mode VARCHAR(15) CHECK (game_mode IN ('math', 'programming')) NOT NULL,
  match_start TIMESTAMP,
  status VARCHAR(20) CHECK (status IN ('waiting', 'starting','in_progress', 'completed', 'abandoned')) DEFAULT 'waiting' -- check is there a function to set a found match status to starting?
);

CREATE TABLE IF NOT EXISTS match_questions(
  match_questions_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID REFERENCES matches(match_id) NOT NULL,
  question_id UUID REFERENCES questions(question_id ) NOT NULL
);

CREATE TABLE IF NOT EXISTS match_log(
  log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID REFERENCES matches(match_id),
  winner_id UUID REFERENCES users(user_id),
  loser_id UUID REFERENCES users(user_id),
  elo_gained INTEGER, -- nullable
  elo_lost INTEGER -- nullable
);

CREATE TABLE IF NOT EXISTS elo_ratings (
  elo_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(user_id) UNIQUE,
  rating INTEGER DEFAULT 600
);


CREATE TABLE IF NOT EXISTS math_questions (
  id SERIAL PRIMARY KEY,
  question_id UUID NOT NULL REFERENCES questions(question_id) ON DELETE CASCADE,
  --equation VARCHAR(20) NOT NULL,
  solution_formula VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS programming_questions (
  id SERIAL PRIMARY KEY,
  question_id UUID NOT NULL REFERENCES questions(question_id) ON DELETE CASCADE,
  --function_signature VARCHAR(25) NOT NULL,
  supported_languages supported_languages NOT NULL
);

CREATE TABLE IF NOT EXISTS elo_history (
  history_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(user_id),
  match_id UUID REFERENCES matches(match_id),
  new_rating INTEGER,
  changed_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS match_stats (
  stat_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID REFERENCES matches(match_id),
  user_id UUID REFERENCES users(user_id),
  num_correct INTEGER NOT NULL,
  total_time INTEGER NOT NULL, -- milliseconds
  created_at TIMESTAMP DEFAULT NOW()
);