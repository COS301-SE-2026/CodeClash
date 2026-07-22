import { Router } from 'express';

import {
  getUserElo,
  getEloHistory,
  updateEloAfterMatch,
  getLeaderboard,
  setUserElo
} from 'src/interface-adapters/controllers/elo.controllers';
// import { getMatches, getMatchById, createMatch, updateMatchStatus, getMatchLog } from 'src/interface-adapters/controllers/matches.controllers';
import { getLeague, getUserStat } from 'src/interface-adapters/controllers/user.controllers';
import { requireAuth } from 'src/interface-adapters/auth/auth.service';
import { UserRepository } from 'src/interface-adapters/repositories/interface-implementations/user.repository';
import { AppDataSource } from '../data-source';
import { User } from 'src/interface-adapters/repositories/db-entities/user.entities';
import { EloRepository } from 'src/interface-adapters/repositories/interface-implementations/elo.repository';
import { Elo_ratings } from 'src/interface-adapters/repositories/db-entities/elo.entities';

const router = Router();

const user_repo = new UserRepository(AppDataSource.getRepository(User))
const elo_repo = new EloRepository(AppDataSource.getRepository(Elo_ratings))

// // Match routes
// router.get('/matches', getMatches);
// router.get('/matches/:match_id', getMatchById);
// router.post('/matches', createMatch);
// router.patch('/matches/:match_id/status', updateMatchStatus);
// router.get('/matches/:match_id/log', getMatchLog);

//elo routes
router.get('/leaderboard', getLeaderboard);
router.get('/elo-get', getUserElo);
router.post('/elo-history', getEloHistory);
router.post('/update', updateEloAfterMatch);
router.post('/elo-set', setUserElo);


// user routes
router.get('/:stat',getUserStat(user_repo)); // this must be last, it's a generic function that fetches any attribute directly in the users table

export default router;