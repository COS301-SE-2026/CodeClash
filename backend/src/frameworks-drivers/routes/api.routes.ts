import { Router } from 'express';
import { EloRatings } from 'src/entities/db-entities/elo.entities';
import { Users } from 'src/entities/db-entities/user.entities';
import {
  getUserElo,
} from 'src/interface-adapters/controllers/elo.controllers';
import { getUserStat } from 'src/interface-adapters/controllers/user.controllers';
import { EloRepository } from 'src/interface-adapters/repositories/elo.repository';
import { UserRepository } from 'src/interface-adapters/repositories/user.repository';
import { getUserRank } from 'src/interface-adapters/controllers/rank.controllers';

import { AppDataSource } from '../config/data-source';
import { LeaderboardSystem } from 'src/application/usecases/services/leaderboard.service';

const router = Router();

const user_repo = new UserRepository(AppDataSource.getRepository(Users))
const elo_repo = new EloRepository(AppDataSource.getRepository(EloRatings))

router.get('/elo-get', getUserElo(elo_repo));
router.get('/rank', getUserRank(elo_repo));

// user routes
router.get('/:stat', getUserStat(user_repo)); // this must be last, it's a generic function that fetches any attribute directly in the users table


export default router;