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
  /**
   * @swagger
   * /api/elo-get:
   *   get:
   *     summary: Returns the authenticated user's ELO rating
   *     tags: [Elo]
   *     responses:
   *       200:
   *         description: ELO rating returned successfully
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Internal server error
   */
  router.get('/elo/elo-get', getUserElo(elo_repo));
  /**
 * @swagger
 * /api/elo/leaderboard:
 *   get:
 *     summary: Returns the top 10 players by elo rating
 *     tags: [Elo]
 *     responses:
 *       200:
 *         description: Leaderboard returned successfully
 *       500:
 *         description: Internal server error
 */
  router.get("/leaderboard", getLeaderboard(leaderboard_service));

  /**
 * @swagger
 * /api/matches:
 *   get:
 *     summary: Returns the authenticated user's match history
 *     tags: [Matches]
 *     responses:
 *       200:
 *         description: Match history returned successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
  router.get('/matches', getMatchHistory(match_history_repo));
  /**
   * @swagger
   * /api/matches/{match_id}:
   *   get:
   *     summary: Returns the details of a specific match
   *     tags: [Matches]
   *     parameters:
   *       - in: path
   *         name: match_id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: The match ID
   *     responses:
   *       200:
   *         description: Match details returned successfully
   *       404:
   *         description: Match not found
   *       500:
   *         description: Internal server error
   */
  router.get('/matches/:match_id', getMatchDetails(match_history_repo));

  /**
   * @swagger
   * /api/friends:
   *   get:
   *     summary: Returns all accepted friends of the authenticated user
   *     tags: [Friends]
   *     responses:
   *       200:
   *         description: Friends list returned successfully
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Internal server error
   */
  router.get('/friends', getFriends(friends_service));
  /**
   * @swagger
   * /api/friends/requests:
   *   get:
   *     summary: Returns the requests a user has sent or received
   *     tags: [Friends]
   *     parameters:
   *       - in: query
   *         name: type
   *         required: false
   *         schema:
   *           type: string
   *           enum: [sent, received]
   *           default: received
   *         description: Whether to return sent or received requests
   *     responses:
   *       200:
   *         description: Friend requests returned successfully
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Internal server error
   */
  router.get('/friends/requests', getFriendRequests(friends_service));
  /**
   * @swagger
   * /api/friends/invite:
   *   post:
   *     summary: Creates a casual game invite and returns an invite code
   *     tags: [Friends]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - user_id
   *             properties:
   *               user_id:
   *                 type: string
   *                 format: uuid
   *                 description: The sender's user ID
   *     responses:
   *       201:
   *         description: Invite created successfully
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Internal server error
   */
  router.post('/friends/invite', createInvite(friends_service));
  /**
   * @swagger
   * /api/friends/request:
   *   post:
   *     summary: Sends a friend request to another user
   *     tags: [Friends]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - receiver_id
   *             properties:
   *               receiver_id:
   *                 type: string
   *                 format: uuid
   *                 description: The user ID of the person to send the request to
   *     responses:
   *       201:
   *         description: Friend request sent successfully
   *       400:
   *         description: receiver_id is required
   *       401:
   *         description: Unauthorized
   *       409:
   *         description: Friend request already exists or wait 24 hours to re-request
   *       500:
   *         description: Internal server error
   */
  router.post('/friends/request', sendFriendRequest(friends_service));
  /**
   * @swagger
   * /api/friends/request/{friendship_id}:
   *   patch:
   *     summary: Accept or decline a friend request
   *     tags: [Friends]
   *     parameters:
   *       - in: path
   *         name: friendship_id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: The ID of the friendship record to respond to
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - status
   *             properties:
   *               status:
   *                 type: string
   *                 enum: [accepted, declined]
   *     responses:
   *       200:
   *         description: Friend request responded to successfully
   *       400:
   *         description: Invalid status or missing friendship_id
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Internal server error
   */
  router.patch('/friends/request/:friendship_id', respondToFriendRequest(friends_service));
  /**
   * @swagger
   * /api/friends/{friendship_id}:
   *   delete:
   *     summary: Removes a friend by deleting the friendship record
   *     tags: [Friends]
   *     parameters:
   *       - in: path
   *         name: friendship_id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: The ID of the friendship to delete
   *     responses:
   *       200:
   *         description: Friend removed successfully
   *       400:
   *         description: friendship_id is required
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Friendship not found
   *       500:
   *         description: Internal server error
   */
  router.delete('/friends/:friendship_id', removeFriend(friends_service));

  /**
   * @swagger
   * /api/achievements/me:
   *   get:
   *     summary: Returns all achievements earned by the authenticated user
   *     tags: [Achievements]
   *     responses:
   *       200:
   *         description: User achievements retrieved successfully
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Internal server error
   */
  router.get('/achievements/me', getUserAchievements(achievement_service));
  /**
   * @swagger
   * /api/achievements:
   *   get:
   *     summary: Returns all achievements in the system
   *     tags: [Achievements]
   *     responses:
   *       200:
   *         description: All achievements retrieved successfully
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Internal server error
   */
  router.get('/achievements', getAllAchievements(achievement_service));

  // user routes
  router.get('/user/rank', getUserRank(leaderboard_service));
  /**
   * @swagger
   * /api/search:
   *   get:
   *     summary: Search for users by username
   *     tags: [Users]
   *     parameters:
   *       - in: query
   *         name: q
   *         required: true
   *         schema:
   *           type: string
   *           minLength: 2
   *         description: Username search query (minimum 2 characters)
   *     responses:
   *       200:
   *         description: Search results returned successfully
   *       400:
   *         description: Query must be at least 2 characters
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Internal server error
   */
  router.get('/user/search', searchUsers(user_repo));
  
  /**
 * @swagger
 * /api/{stat}:
 *   get:
 *     summary: Returns a specific attribute of the authenticated user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: stat
 *         required: true
 *         schema:
 *           type: string
 *           enum: [username, email, avatar_id, league, current_streak, winning_streak]
 *         description: The user attribute to retrieve
 *     responses:
 *       200:
 *         description: User stat returned successfully
 *       400:
 *         description: Invalid stat requested
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
  router.get('/user/:stat', getUserStat(user_repo)); // this must be last, it's a generic function that fetches any attribute directly in the users table

  return router;
}
