import { Router } from 'express';

import {
  getUserElo,
  getEloHistory,
  updateEloAfterMatch,
  getLeaderboard,
  setUserElo
} from '../api/controllers/elo.controllers';
import { getMatches, getMatchById, createMatch, updateMatchStatus, getMatchLog } from '../api/controllers/matches.controllers';
import { getLeague, getUserStat } from '../api/controllers/user.controllers';
import { requireAuth } from '../services/auth.service';

const router = Router();

router.use(requireAuth) // protects all routes with token authorisation

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

router.get('/league', getLeague);
router.get('/:stat',getUserStat); // this must be last, it's a generic function that fetches any attribute directly in the users table

export default router;