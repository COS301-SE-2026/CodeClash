INSERT INTO shop_items (category, name, description, price, rariy, metadata) VALUES
-- POWERUPS
('powerup', 'Time Boost', 'Reduces your time-taken stat, improving your final score and ELO gain', 150, 'common',
'{"effect": "reduce_time", "value_seconds": 10 }'),
('powerup', 'Hint', 'Reveals a hint or partial solution for your current question.', 200, 'rare',
'{"effect": "reveal_hint", "scope": "current_question" }'),
('powerup', 'Shield', 'Blocks the next power-down used against you this match.', 275, 'epic',
'{"effect": "block_next_powerdown", "consumed_on_use": true }'),
('powerup', 'Score Surge', 'Adds 10% of your total earned score to your final score.', 250, 'epic',
'{ "effect": "score_multiplier", "value_percent": 10 }'),
('powerup', 'Second Wind', 'Restores one lost life unit point during the match.', 200, 'rare',
'{ "effect": "restore_life", "value": 1 }'),

-- POWER DOWNS --------
('powerup', 'Bug Injection', 'Inserts bugs or random characters into your opponent''s current answer.', 150, 'common',
'{ "effect": "insert_bugs", "scope": "current_answer" }'),
('powerup', 'Wipe', 'Erases your opponents''s current in-progress answer. Only one allowed per match.', 300, 'legendary',
'{ "effect": "wipe_answer", "scope": "current_answer", "max_uses-per_match": 1 }'),
('powerup', 'Question Blackout', 'Hides the opponent''s question from view for a set duration (or permanently).', 200, 'legendary',
'{ "effect": "block_question", "duration_seconds": 30 }'),
('powerup', 'Time Sink', 'Increase your opponents''s time taken stat, lowering their score and ELO gain.', 150, 'common',
'{ "effect": "increase_time", "value_seconds": 10 }' ),
('powerup', 'Life Drain', 'Removes one life point from your opponent.', 250, 'epic',
'{ "effect": "drain_life", "value": 1 }');