import { Router } from 'express';
import { EloRatings } from 'src/entities/db-entities/elo.entities';
import { Users } from 'src/entities/db-entities/user.entities';
import { Matches, MatchLog } from 'src/entities/db-entities/match.entities';
import { MatchStats } from 'src/entities/db-entities/match-stats.entities';
import { getUserElo } from 'src/interface-adapters/controllers/elo.controllers';
import { getUserStat, searchUsers } from 'src/interface-adapters/controllers/user.controllers';
import { EloRepository } from 'src/interface-adapters/repositories/elo.repository';
import { UserRepository } from 'src/interface-adapters/repositories/user.repository';
import { getUserRank } from 'src/interface-adapters/controllers/rank.controllers';
import { MatchHistoryRepository } from 'src/interface-adapters/repositories/match-history.repository';
import { requireAuth } from 'src/interface-adapters/auth/auth.service';
import { Achievement } from 'src/entities/db-entities/achievement.entities';
import { Friendship, FriendInvite } from 'src/entities/db-entities/friendship.entities';
import { AchievementRepository } from 'src/interface-adapters/repositories/achievement.repository';
import { FriendRepository } from 'src/interface-adapters/repositories/friend.repository';
import { AchievementService } from 'src/application/usecases/services/achievement.service';
import { FriendService } from 'src/application/usecases/services/friend.service';
import { getAllAchievements, getUserAchievements } from 'src/interface-adapters/controllers/achievement.controllers';
import {
  getFriends,
  getFriendRequests,
  sendFriendRequest,
  respondToFriendRequest,
  removeFriend,
  createInvite
} from '../../interface-adapters/controllers/friend.controllers';

import { AppDataSource } from '../config/data-source';
import { getMatchDetails, getMatchHistory } from 'src/interface-adapters/controllers/match-history.controllers';
import { LeaderboardSystem } from 'src/application/usecases/services/leaderboard.service';

const router = Router();
const user_repo = new UserRepository(AppDataSource.getRepository(Users))
const elo_repo = new EloRepository(AppDataSource.getRepository(EloRatings))
const achievement_repo = new AchievementRepository(AppDataSource.getRepository(Achievement), AppDataSource.getRepository(Users));
const friend_repo = new FriendRepository(AppDataSource.getRepository(Friendship), AppDataSource.getRepository(FriendInvite), AppDataSource.getRepository(EloRatings));
const achievement_service = new AchievementService(achievement_repo);
const friend_service = new FriendService(friend_repo);
const match_history_repo = new MatchHistoryRepository(AppDataSource.getRepository(Matches), AppDataSource.getRepository(MatchLog), AppDataSource.getRepository(MatchStats));

router.use(requireAuth(user_repo))

const leaderboard_system = new LeaderboardSystem(elo_repo);

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
router.get('/elo-get', getUserElo(elo_repo));

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
 * /api/matches/{match_id}/log:
 *   get:
 *     summary: Returns the history of a completed match
 *     tags: [Matches]
 *     parameters:
 *       - in: path
 *         name: match_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Match log returned successfully
 *       404:
 *         description: Match not found
 *       500:
 *         description: Internal server error
 */
//router.get('/matches/:match_id/log', getMatchLog);

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
//router.get('/elo/leaderboard', getLeaderboard);

// ─── Friends ──────────────────────────────────────────────────────────────────

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
router.get('/friends/requests', getFriendRequests(friend_service));

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
router.post('/friends/invite', createInvite(friend_service));

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
router.post('/friends/request', sendFriendRequest(friend_service));

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
router.patch('/friends/request/:friendship_id', respondToFriendRequest(friend_service));

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
router.get('/friends', getFriends(friend_service));

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
router.delete('/friends/:friendship_id', removeFriend(friend_service));

// ─── Powerups (commented out until demo 4) ───────────────────────────────────

/**
 * @swagger
 * /api/powerups:
 *   get:
 *     summary: Get all available powerups
 *     tags: [Powerups]
 *     responses:
 *       200:
 *         description: All available powerups retrieved successfully
 *       500:
 *         description: Internal server error
 */
//router.get('/powerups', getPowerups);

/**
 * @swagger
 * /api/powerups/match/{match_id}:
 *   get:
 *     summary: Get all powerups used in a match
 *     tags: [Powerups]
 *     parameters:
 *       - in: path
 *         name: match_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Powerups used in match returned successfully
 *       404:
 *         description: Match not found
 *       500:
 *         description: Internal server error
 */
//router.get('/powerups/match/:match_id', getMatchPowerups);

/**
 * @swagger
 * /api/powerups/use:
 *   post:
 *     summary: Record a powerup being used in a match
 *     tags: [Powerups]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - match_id
 *               - user_id
 *               - powerup_id
 *             properties:
 *               match_id:
 *                 type: string
 *                 format: uuid
 *               user_id:
 *                 type: string
 *                 format: uuid
 *               powerup_id:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Powerup use recorded successfully
 *       404:
 *         description: User, match and/or powerup not found
 *       500:
 *         description: Internal server error
 */
//router.post('/powerups/use', usePowerup);

// ─── Achievements ─────────────────────────────────────────────────────────────

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

// ─── User ─────────────────────────────────────────────────────────────────────

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
router.get('/search', searchUsers(user_repo));

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
router.get('/:stat', getUserStat(user_repo)); // this must be last

export default router;
