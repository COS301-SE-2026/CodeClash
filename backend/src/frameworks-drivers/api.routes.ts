import { Router } from 'express';
import { EloRatings } from 'src/entities/db-entities/elo.entities';
import { Users } from 'src/entities/db-entities/user.entities';
import {
  getUserElo,
} from 'src/interface-adapters/controllers/elo.controllers';
import { createUser, getUserStat } from 'src/interface-adapters/controllers/user.controllers';
import { EloRepository } from 'src/interface-adapters/repositories/elo.repository';
import { UserRepository } from 'src/interface-adapters/repositories/user.repository';


import { AppDataSource } from './config/data-source';
import { LeaderboardService } from 'src/application/usecases/services/leaderboard.service';
import { getLeaderboard } from 'src/interface-adapters/controllers/leaderboard.controller';
import { CreateUser } from 'src/application/usecases/services/user-creation.service';
import { creationRequireAuth, requireAuth } from 'src/interface-adapters/auth/auth.service';


const router = Router();
const user_repo = new UserRepository(AppDataSource.getRepository(Users))
const elo_repo = new EloRepository(AppDataSource.getRepository(EloRatings))


const create_user_service = new CreateUser(user_repo, elo_repo);
router.post('/create-user', creationRequireAuth(), createUser(create_user_service));

router.use(requireAuth(user_repo));

// elo routes
router.get('/elo-get', getUserElo(elo_repo));
const leaderboard_service = new LeaderboardService(elo_repo);
router.get("/leaderboard-get", getLeaderboard(leaderboard_service));

// user routes


router.get('/:stat', getUserStat(user_repo)); // this must be last, it's a generic function that fetches any attribute directly in the users table


export default router;