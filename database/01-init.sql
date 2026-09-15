--very generic tables that can be changed later, just trying not to keep the file empty

CREATE TYPE GAME_MODES AS ENUM ('math', 'programming');
CREATE TYPE ANSWER_FORMATS AS ENUM ('numeric', 'decimal', 'set', 'variables', 'expression', 'simplified', 'factored', 'equation');
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
  league VARCHAR(10) NOT NULL DEFAULT 'Mercury',
  current_streak INTEGER NOT NULL DEFAULT 0,
  winning_streak INTEGER NOT NULL DEFAULT 0,
  last_played_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS questions (
  question_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_mode GAME_MODES NOT NULL,
  difficulty INTEGER NOT NULL CHECK (difficulty >= 1 AND difficulty <= 24),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  time_limit TIME(2) NOT NULL,
  answer_format ANSWER_FORMATS, 
  answer_precision INTEGER
);

CREATE TABLE IF NOT EXISTS answers (
  answer_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID REFERENCES questions(question_id),
  answer TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS matches(
  match_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_type VARCHAR(10) CHECK (match_type IN ('ranked', 'casual')) NOT NULL,
  game_mode VARCHAR(15) CHECK (game_mode IN ('math', 'programming')) NOT NULL,
  match_start TIMESTAMP,
  status VARCHAR(20) CHECK (status IN ('waiting', 'starting','in_progress', 'completed', 'abandoned')) DEFAULT 'waiting',
  tournament_id UUID REFERENCES tournaments(tournament_id), -- NULLABLE
  tournament_round INTEGER
);

CREATE TABLE IF NOT EXISTS match_players (
  match_player_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID REFERENCES matches(match_id) NOT NULL,
  user_id UUID REFERENCES users(user_id) NOT NULL,
  placement INTEGER,
  eliminated_at TIMESTAMP,   -- null if active
  UNIQUE (match_id, user_id) -- prevents a player being added twice
)

CREATE TABLE IF NOT EXISTS tournaments (
  tournament_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL,
  status VARCHAR(20) CHECK (status in ('open', 'in_progress', 'completed')) DEFAULT 'open',
  created_at TIMESTAMP DEFAULT NOW()
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

--copied over from original implementation of tables
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
  sender_id UUID REFERENCES users(user_id),
  invite_code VARCHAR(50) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
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
  earned_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, achievement_id)
);

-- ------- SHOP -----------
CREATE TABLE IF NOT EXISTS shop_items (
  shop_item_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category VARCHAR(20) CHECK (category IN ('avatar', 'pose', 'powerup')) NOT NULL,
  name VARCHAR(50) NOT NULL,
  description VARCHAR(150),
  price FLOAT NOT NULL,
  rarity VARCHAR(20) CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')) DEFAULT 'common',
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS transactions (
  transaction_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(user_id),
  shop_item_id UUID REFERENCES shop_items(shop_item_id),    -- nullable if they're earning money
  amount FLOAT NOT NULL,
  type VARCHAR(10) CHECK (type in ('money_in', 'money_out')) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wallets (
  wallet_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(user_id),
  balance FLOAT NOT NULL DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_items (
  user_item_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(user_id),
  shop_item_id UUID REFERENCES shop_items(shop_item_id),
  acquired_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, shop_item_id)   -- stops them owning the same thing twice
);

CREATE TABLE IF NOT EXISTS equipped_items (
  equipped_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(user_id),
  avatar_item_id UUID REFERENCES shop_items(shop_item_id),
  pose_item_id UUID REFERENCES shop_items(shop_item_id),
  powerup_item_id UUID REFERENCES shop_items(shop_item_id),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS match_powerups (
  match_powerup_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID REFERENCES matches(match_id),
  user_id UUID REFERENCES users(user_id),
  powerup_item_id UUID REFERENCES shop_items(shop_item_id),
  used_at TIMESTAMP DEFAULT NOW()
);

