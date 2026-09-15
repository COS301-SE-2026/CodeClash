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