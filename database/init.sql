--very generic tables that can be changed later, just trying not to keep the file empty
CREATE TABLE IF NOT EXISTS users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TYPE problem_category AS ENUM ('math', 'programming');

CREATE TABLE IF NOT EXISTS problems (
  problem_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type problem_category NOT NULL,
  difficulty_level ENUM('Easy', 'Medium', 'Difficult') NOT NULL,
  title VARCHAR(20) NOT NULL,
  description VARCHAR(40) NOT NULL,
  time_limit TIME(2) NOT NULL
);

CREATE TABLE IF NOT EXISTS elo_ratings (
  elo_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(user_id),
  game_mode VARCHAR(20) NOT NULL,
  rating INTEGER DEFAULT 600,
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT math_category_check CHECK (
        (SELECT type FROM problems WHERE id = problem_id) = 'math'
    )
);


//virtual table with category enum variable math or programming and then children tables have category=math or programming

CREATE TABLE IF NOT EXISTS math_problems (
  problem_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  difficulty_level ENUM('Easy', 'Medium', 'Difficult') NOT NULL,
  title VARCHAR(20) NOT NULL,
  description VARCHAR(40) NOT NULL,
  time_limit TIME(2) NOT NULL,
  equation VARCHAR(20) NOT NULL,
  solution_formula VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS programming_problems (
  problem_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  difficulty_level ENUM('Easy', 'Medium', 'Difficult') NOT NULL,
  title VARCHAR(20) NOT NULL,
  description VARCHAR(40) NOT NULL,
  time_limit TIME(2) NOT NULL,
  function_signature VARCHAR(25) NOT NULL,
  supported_languages ENUM('java', 'c++') NOT NULL,
  CONSTRAINT programming_category_check CHECK (
        (SELECT type FROM problems WHERE id = problem_id) = 'programming'
    )
);