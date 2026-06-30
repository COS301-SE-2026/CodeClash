import { Router } from 'express';
import { getMatches, getMatchById, createMatch, updateMatchStatus, getMatchLog } from '../controllers/matches.controllers';
import {
  getUserElo,
  getEloHistory,
  updateEloAfterMatch,
  getLeaderboard,
  setUserElo
} from '../controllers/elo.controllers';

const router = Router();

// Match routes
router.get('/matches', getMatches);
router.get('/matches/:match_id', getMatchById);
router.post('/matches', createMatch);
router.patch('/matches/:match_id/status', updateMatchStatus);
router.get('/matches/:match_id/log', getMatchLog);

//elo routes
router.get('/leaderboard', getLeaderboard);
router.post('/elo', getUserElo),
router.post('/elo-history',getEloHistory)
router.post('/update', updateEloAfterMatch);
router.post('/elo',setUserElo);

export default router;