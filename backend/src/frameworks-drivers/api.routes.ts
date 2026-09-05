import { Router } from 'express';
import { getUserElo } from 'src/interface-adapters/controllers/elo.controllers';
import { createUser, getUserStat, searchUsers } from 'src/interface-adapters/controllers/user.controllers';

import { LeaderboardService } from 'src/application/usecases/services/leaderboard.service';
import { getLeaderboard } from 'src/interface-adapters/controllers/leaderboard.controller';
import { CreateUser } from 'src/application/usecases/services/user-creation.service';
import { creationRequireAuth, requireAuth } from 'src/interface-adapters/auth/auth.service';

import { getUserRank } from 'src/interface-adapters/controllers/rank.controllers';
import { IEloRepository } from 'src/application/interfaces/repositories/IEloRepository';
import { IUserRepository } from 'src/application/interfaces/repositories/IUserRepository';
import { getAllAchievements, getUserAchievements } from 'src/interface-adapters/controllers/achievement.controllers';
import { AchievementService } from 'src/application/usecases/services/achievement.service';
import { createInvite, getFriendRequests, getFriends, removeFriend, respondToFriendRequest, sendFriendRequest } from 'src/interface-adapters/controllers/friend.controllers';
import { FriendService } from 'src/application/usecases/services/friend.service';
import { getMatchDetails, getMatchHistory } from 'src/interface-adapters/controllers/match-history.controllers';
import { MatchHistoryRepository } from 'src/interface-adapters/repositories/match-history.repository';

export const createAPIRoutes = (
  elo_repo: IEloRepository,
  user_repo: IUserRepository,
  match_history_repo: MatchHistoryRepository,
  leaderboard_service: LeaderboardService,
  achievement_service: AchievementService,
  friends_service: FriendService

) => {
  const router = Router();


  const create_user_service = new CreateUser(user_repo, elo_repo);

  router.post('/create-user', creationRequireAuth(), createUser(create_user_service));


  router.use(requireAuth(user_repo));

  // elo routes
  router.get('/elo/elo-get', getUserElo(elo_repo));
  router.get("/leaderboard-get", getLeaderboard(leaderboard_service));

  router.get('/matches', getMatchHistory(match_history_repo));
  router.get('/matches/:match_id', getMatchDetails(match_history_repo));

  router.get('/friends', getFriends(friends_service));
  router.get('/friends/requests', getFriendRequests(friends_service));
  router.post('/friends/invite', createInvite(friends_service));
  router.post('/friends/request', sendFriendRequest(friends_service));
  router.patch('/friends/request/:friendship_id', respondToFriendRequest(friends_service));
  router.delete('/friends/:friendship_id', removeFriend(friends_service));

  // user routes
  router.get('/user/rank', getUserRank(leaderboard_service));
  router.get('/user/search', searchUsers(user_repo));
  router.get('/user/:stat', getUserStat(user_repo)); // this must be last, it's a generic function that fetches any attribute directly in the users table

  router.get('/achievements/me', getUserAchievements(achievement_service));
  router.get('/achievements', getAllAchievements(achievement_service));


  return router;
}
