import { Router } from 'express';

import {
  getUserElo,
  getEloHistory,
  updateEloAfterMatch,
  getLeaderboard
} from '../controllers/elo.controllers';
import { getMatches, getMatchById, createMatch, updateMatchStatus, getMatchLog } from '../controllers/matches.controllers';

const router = Router();

// Match routes
router.get('/matches', getMatches);
router.get('/matches/:match_id', getMatchById);
router.post('/matches', createMatch);
router.patch('/matches/:match_id/status', updateMatchStatus);
router.get('/matches/:match_id/log', getMatchLog);

//elo routes
router.get('/leaderboard', getLeaderboard);
router.get('/:user_id', getUserElo);
router.get('/:user_id/history', getEloHistory);
router.post('/update', updateEloAfterMatch);

export default router;