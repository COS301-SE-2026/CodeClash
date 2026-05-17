import { Router } from 'express';
import {
  getUserElo,
  getEloHistory,
  updateEloAfterMatch,
  getLeaderboard
} from '../controllers/elo.controllers';

const router = Router();

router.get('/:user_id', getUserElo);
router.get('/:user_id/history', getEloHistory);
router.post('/update', updateEloAfterMatch);
router.get('/leaderboard', getLeaderboard);

export default router;