import { Router } from 'express';

import {
  getUserElo,
  getEloHistory,
  updateEloAfterMatch,
  getLeaderboard,
  setUserElo
} from '../controllers/elo.controllers';
import { getMatches, getMatchById, createMatch, updateMatchStatus, getMatchLog } from '../controllers/matches.controllers';
import { getUserStat } from '../controllers/user.controllers';

const router = Router();

// Match routes
router.get('/matches', getMatches);
router.get('/matches/:match_id', getMatchById);
router.post('/matches', createMatch);
router.patch('/matches/:match_id/status', updateMatchStatus);
router.get('/matches/:match_id/log', getMatchLog);

//elo routes
router.get('/leaderboard', getLeaderboard);
router.get('/elo-get', getUserElo);
router.post('/elo-history', getEloHistory);
router.post('/update', updateEloAfterMatch);
router.post('/elo-set', setUserElo);


// user routes
router.get('/avatar_id',getUserStat);

export default router;