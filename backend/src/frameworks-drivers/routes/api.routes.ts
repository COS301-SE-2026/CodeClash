import { Router } from 'express';
import { EloRatings } from 'src/entities/db-entities/elo.entities';
import { Users } from 'src/entities/db-entities/user.entities';
import { Matches, MatchLog } from 'src/entities/db-entities/match.entities';
import { MatchStats } from 'src/entities/db-entities/match-stats.entities';
import {
  getUserElo,
} from 'src/interface-adapters/controllers/elo.controllers';
import { getUserStat } from 'src/interface-adapters/controllers/user.controllers';
import { EloRepository } from 'src/interface-adapters/repositories/elo.repository';
import { UserRepository } from 'src/interface-adapters/repositories/user.repository';
import { MatchHistoryRepository } from 'src/interface-adapters/repositories/match-history.repository';
import { requireAuth } from 'src/interface-adapters/auth/auth.service';
import { getUserRank } from 'src/interface-adapters/controllers/rank.controllers';

import { AppDataSource } from '../config/data-source';
import { getMatchDetails, getMatchHistory } from 'src/interface-adapters/controllers/match-history.controllers';
import { LeaderboardSystem } from 'src/application/usecases/services/leaderboard.service';

const router = Router();
const user_repo = new UserRepository(AppDataSource.getRepository(Users))
const elo_repo = new EloRepository(AppDataSource.getRepository(EloRatings))
const match_history_repo = new MatchHistoryRepository( AppDataSource.getRepository(Matches), AppDataSource.getRepository(MatchLog), AppDataSource.getRepository(MatchStats));

router.use(requireAuth(user_repo))

const leaderboard_system = new LeaderboardSystem(elo_repo);

router.get('/elo-get', getUserElo(elo_repo));
router.get('/rank', getUserRank(leaderboard_system));

router.get('/matches', getMatchHistory(match_history_repo));
router.get('/matches/:match_id', getMatchDetails(match_history_repo));

// user routes
router.get('/:stat', getUserStat(user_repo)); // this must be last, it's a generic function that fetches any attribute directly in the users table


export default router;