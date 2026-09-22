-- -- TYPES -------------------------------------------------------------------------
CREATE TYPE MATCH_MODES AS ENUM ('math', 'programming');

CREATE TYPE MATCH_TYPES AS ENUM ('ranked', 'casual', 'tournament');

CREATE TYPE MATCH_STATUS AS ENUM (
  'waiting',
  'starting',
  'in_progress',
  'completed',
  'abandoned'
);

CREATE TYPE ANSWER_FORMATS AS ENUM (
  'numeric',
  'decimal',
  'set',
  'variables',
  'expression',
  'simplified',
  'factored',
  'equation'
);

CREATE TYPE MatchPlayer AS (
  id UUID,
  position INTEGER,
  elo_change INTEGER,
  num_correct INTEGER,
  total_time INTEGER, --milliseconds
  elimination_round INTEGER
);

CREATE TYPE MatchQuestion AS (
  id UUID,
  answer_time INTEGER,
  attempt_number INTEGER
);

CREATE TYPE MatchPowerUps AS (
  powerup_id UUID,
  user_id UUID,
  used_at TIMESTAMP
);
 --copied over from original implementation of tables
CREATE TYPE friendship_status AS ENUM ('pending', 'accepted', 'declined', 'blocked');

-- TABLES -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS leagues(
  league_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  league_name TEXT UNIQUE NOT NULL,
  elo_range int4range NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cognito_id VARCHAR(50) UNIQUE,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  elo INTEGER NOT NULL DEFAULT 600,
  avatar_id Integer,
  league VARCHAR(10) NOT NULL DEFAULT 'Mercury',
  current_streak INTEGER NOT NULL DEFAULT 0,
  winning_streak INTEGER NOT NULL DEFAULT 0,
  last_played_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS questions (
  question_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_mode MATCH_MODES NOT NULL,
  difficulty INTEGER NOT NULL CHECK (
    difficulty >= 1
    AND difficulty <= 24
  ),
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
  players JSONB NOT NULL DEFAULT '[]',
  questions JSONB NOT NULL DEFAULT '[]',
  power_ups JSONB NOT NULL DEFAULT '[]',
  match_type MATCH_TYPES NOT NULL,
  match_mode MATCH_MODES NOT NULL,
  match_start TIMESTAMP,
  match_end TIMESTAMP,
  status MATCH_STATUS NOT NULL DEFAULT 'waiting' -- check is there a function to set a found match status to starting?
);

CREATE TABLE IF NOT EXISTS elo_history (
  history_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(user_id),
  match_id UUID REFERENCES matches(match_id),
  new_rating INTEGER,
  changed_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT unique_match_player
  UNIQUE (match_id, user_id)
);

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

-- Wow factor added in the CodeClash shop
CREATE TYPE powerup_type AS ENUM (
  'add_time_opponent',
  'reduce_type_self',
  'add_bug_opponent'
);

--more could be added
-- manually add different levels of the same powerup ??
CREATE TABLE IF NOT EXISTS powerups (
  powerup_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type powerup_type NOT NULL,
  description VARCHAR(100) NOT NULL
);

-- TRIGGERS -------------------------------------------------------------------------


-- CREATE OR REPLACE FUNCTION validate_match_players() RETURNS TRIGGER 
-- LANGUAGE plpgsql 
-- AS $$ DECLARE player MatchPlayer;
-- BEGIN 
--   FOREACH player IN ARRAY NEW.players LOOP 
--     IF NOT EXISTS(
--       SELECT
--         1
--       FROM
--         users
--       WHERE
--         user_id = player.id
--     ) 
--     THEN RAISE EXCEPTION 'Player does not exist';
--      END IF;
--   END LOOP;
--   RETURN NEW;
-- END;
-- $$;

-- CREATE TRIGGER trigger_validate_match_players
-- BEFORE INSERT OR UPDATE OF players
-- ON matches
-- FOR EACH ROW 
-- EXECUTE FUNCTION validate_match_players();


-- CREATE OR REPLACE FUNCTION validate_match_questions() RETURNS TRIGGER 
-- LANGUAGE plpgsql
-- AS $$
-- DECLARE question MatchQuestion;
-- BEGIN 
--   FOREACH question IN ARRAY NEW.questions LOOP
--     IF NOT EXISTS(
--       SELECT 1
--       FROM questions
--       WHERE question_id = question.id
--     )
--     THEN RAISE EXCEPTION 'Question does not exist';
--     END IF;
--   END LOOP;
--   RETURN NEW;
-- END;
-- $$;

-- CREATE TRIGGER trigger_validate_match_questions
-- BEFORE INSERT OR UPDATE OF questions
-- ON matches
-- FOR EACH ROW 
-- EXECUTE FUNCTION validate_match_questions();


-- CREATE OR REPLACE FUNCTION record_elo_history() RETURNS TRIGGER 
-- LANGUAGE plpgsql
-- AS $$
-- DECLARE player MatchPlayer;
-- BEGIN 
--   IF NEW.status = 'completed'
--     AND (
--       TG_OP = 'INSERT'
--       OR OLD.status IS DISTINCT FROM 'completed'
--     )
--   THEN 
--     FOREACH player IN ARRAY NEW.players
--     LOOP 
--       INSERT INTO elo_history (
--         user_id,
--         match_id,
--         new_rating,
--         changed_at
--       )
--       SELECT 
--         player.id,
--         NEW.match_id,
--         u.elo,
--         NOW()
--       FROM users u 
--       WHERE u.user_id = player.id;
--     END LOOP;
--   END IF;

--   RETURN NEW;
-- END;
-- $$;

-- CREATE TRIGGER trigger_save_elo
-- AFTER INSERT OR UPDATE OF status
-- ON matches
-- FOR EACH ROW
-- EXECUTE FUNCTION record_elo_history();

-- CREATE OR REPLACE FUNCTION validate_match_powerups() RETURNS TRIGGER
-- LANGUAGE plpgsql
-- AS $$
-- DECLARE powerup MatchPowerUps;
-- BEGIN
--   FOREACH powerup IN ARRAY NEW.power_ups
--   LOOP
--     IF NOT EXISTS (
--       SELECT 1
--       FROM  powerups
--       WHERE powerup_id = powerup.powerup_id
--     )
--     THEN RAISE EXCEPTION 'Power up does not exist';
--     END IF;

--     IF NOT EXISTS (
--       SELECT 1
--       FROM users
--       WHERE user_id = powerup.user_id
--     )
--     THEN RAISE EXCEPTION 'User does not exist';
--     END IF;

--     IF NOT EXISTS (
--       SELECT 1
--       FROM unnest(NEW.players) AS p
--       WHERE p.id = powerup.user_id
--     )
--     THEN RAISE EXCEPTION 'User is not a player in the match';
--     END IF;
--   END LOOP;
--   RETURN NEW;
-- END;
-- $$;

-- CREATE TRIGGER trigger_validate_match_powerups
-- BEFORE INSERT OR UPDATE OF power_ups
-- ON matches
-- FOR EACH ROW
-- EXECUTE FUNCTION validate_match_powerups();