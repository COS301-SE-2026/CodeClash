import { Router } from 'express';

import {
  getUserElo,
} from 'src/interface-adapters/controllers/elo.controllers';
// import { getMatches, getMatchById, createMatch, updateMatchStatus, getMatchLog } from 'src/interface-adapters/controllers/matches.controllers';
import { getUserStat } from 'src/interface-adapters/controllers/user.controllers';
import { UserRepository } from 'src/interface-adapters/repositories/user.repository';
import { AppDataSource } from '../config/data-source';
import { Users } from 'src/entities/db-entities/user.entities';
import { EloRepository } from 'src/interface-adapters/repositories/elo.repository';
import { EloRatings } from 'src/entities/db-entities/elo.entities';

const router = Router();

const user_repo = new UserRepository(AppDataSource.getRepository(Users))
const elo_repo = new EloRepository(AppDataSource.getRepository(EloRatings))

//elo routes
router.get('/elo-get', getUserElo(elo_repo));

// user routes
router.get('/:stat',getUserStat(user_repo)); // this must be last, it's a generic function that fetches any attribute directly in the users table

export default router;