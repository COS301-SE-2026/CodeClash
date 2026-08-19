import { Router } from 'express';
import { EloRatings } from 'src/entities/db-entities/elo.entities';
import { Users } from 'src/entities/db-entities/user.entities';
import {
  getUserElo,
} from 'src/interface-adapters/controllers/elo.controllers';
import { getUserStat } from 'src/interface-adapters/controllers/user.controllers';
import { EloRepository } from 'src/interface-adapters/repositories/elo.repository';
import { UserRepository } from 'src/interface-adapters/repositories/user.repository';


import { AppDataSource } from '../config/data-source';

const router = Router();

const user_repo = new UserRepository(AppDataSource.getRepository(Users))
const elo_repo = new EloRepository(AppDataSource.getRepository(EloRatings))
router.get('/elo-get', getUserElo(elo_repo));

// user routes
router.get('/:stat', getUserStat(user_repo)); // this must be last, it's a generic function that fetches any attribute directly in the users table

export default router;

import {
  getFriendsById,
  getFriendRequests,
  addFriendInvite,
  sendFriendRequest,
  respondToFriendRequest,
  removeFriend
} from '../../interface-adapters/controllers/friends.controllers';

import{
  getPowerups,
  getMatchPowerups,
  usePowerup,
  getAchievements,
  awardAchievement,
  getUserAchievements
} from '../../interface-adapters/controllers/powerups.controllers'
const router = Router();

/** 
 * @swagger
 * /api/matches/{match_id}/log:
 *  get:
 *    summary: Returns the history of a completed match
 *    tags: [Matches]
 *    parameters:
 *      - in: path
 *        name: match_id
 *        required: true
 *        schema:
 *          type: string
 *          format: uuid
 *    responses:
 *      200:
 *        description: Match log returned successfully
 *      404:
 *        description: Match not found
 *      500:
 *        description: Internal server error
*/
//router.get('/matches/:match_id/log', getMatchLog);

/**
 * @swagger
 * /api/elo/leaderboard:
 *  get:
 *    summary: Returns the top 10 players by elo rating
 *    tags: [Elo]
 *    reponses:
 *      200:
 *        description:  Returned the leaderboard successfully
 *      500:
 *        description: Internal server error
 */
//router.get('/elo/leaderboard', getLeaderboard);
/**

//friends routes
/**
 * @swagger
 * /api/friends/requests/{user_id}:
 *  get:
 *    summary: Returns the requests a user has sent/received
 *    tags: [Friends]
 *    parameters:
 *      - in: path
 *        name: user_id
 *        required: true
 *        schema:
 *          type: string
 *          format: uuid
 *      - in: query
 *        name: type
 *        required: true
 *        schema:
 *          type: string
 *          default: received
 *    responses:
 *      200:
 *        description: Returned all user's friend requests successfully
 *      500:
 *        description: Internal server error
 */
router.get('/friends/requests/:user_id', getFriendRequests);
/**
 * @swagger
 * /api/friends/invite:
 *  post:
 *    summary: Adds the play invite request to the database
 *    tags: [Friends]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - sender_id
 *              - invite_code
 *              - expires_at
 *            properties:
 *              sender_id:
 *                type: string
 *                format: uuid
 *              invite_code:
 *                type: string
 *              expires_at:
 *                type: string
 *                format: date-time
 *    responses:
 *      201:
 *        description: Added the play invite successfully
 *      500:
 *        description: Internal server error
 */
router.post('/friends/invite', addFriendInvite);
/**
 * @swagger
 * /api/friends/request
 *  post:
 *    summary: Creates a pending friendship
 *    tags: [Friends]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - requester_id
 *              - receiver_id
 *            properties:
 *              requester_id:
 *                type: string
 *                format: uuid
 *              receiver_id:
 *                type: string
 *                format: uuid
 *    responses:
 *      200:
 *        description: Friend request sent successfully
 *      500:
 *        description: Internal server error
 *            
 */
router.post('/friends/request', sendFriendRequest);
/**
 * @swagger
 * /api/friends/request/{friendship_id}
 *  patch:
 *    summary: Accept or Reject a friend request
 *    tags: [Friends]
 *    parameters:
 *      - in: path
 *        name: verdict
 *        required: true
 *        schema:
 *          type: string
 *          enum: [accept, reject]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - friendship_id
 *            properties:
 *              friendship_id:
 *                type: string
 *                format: uuid
 *    responses:
 *      200:
 *        description: Response created to friend request successfully
 *      404:
 *        description: Friend request not found
 *      500:
 *        description: Internal server error
 */
router.patch('/friends/request/:friendship_id', respondToFriendRequest);
/**
 * @swagger
 * /api/friends/{user_id}:
 *  get:
 *    summary: Returns all the friends of a user
 *    tags: [Friends]
 *    parameters:
 *      - in: path
 *        name: user_id
 *        required: true
 *        schema:
 *          type: string
 *          format: uuid
 *    responses:
 *      200:
 *        description: Returned user's friends successfully
 *      404:
 *        description: User not found
 *      500:
 *        description: Internal server error
 */
router.get('/friends/:user_id', getFriendsById);
/**
 * @swagger
 * /api/friends/{friendship_id}
 *  delete:
 *    summary: Deletes a friend
 *    tags: [Friends]
 *    parameters: 
 *      - in: path
 *        name: friendship_id
 *        required: true
 *        schema:
 *          type: string
 *          format: uuid
 *    responses:
 *      200:
 *        description: Deleted friend successfully
 *      404:
 *        description: Friend not found
 *      500:
 *        description: Internal server error
 * 
 */
router.delete('/friends/:friendship_id', removeFriend);

// powerups

/**
 * @swagger
 * /api/powerups
 *  get:
 *    summary: Get all available powerups
 *    tags: [Powerups]
 *    responses:
 *      200:
 *        description: All available powerups were retrieved successfully
 *      500:
 *        description: Internal server error
 */
router.get('/powerups', getPowerups);
/**
 * @swagger
 * /api/powerups/match/{match_id}
 *  get:
 *    summary: Get all powerups used in a match
 *    tags: [Powerups]
 *    parameters:
 *      - in: path
 *        name: match_id
 *        required: true
 *        schema:
 *          type: string
 *          format: uuid
 *    responses:
 *      200: 
 *        description: All powerups used in specified match were returned successfully
 *      404:
 *        description: Match not found
 *      500:
 *        description: Internal server error
 *      
 */
router.get('/powerups/match/:match_id', getMatchPowerups);
/**
 * @swagger
 * /api/powerups/use
 *  post:
 *    summary: Record a powerup being used in a match
 *    tags: [Powerups]
 *    requestBody:
 *      required: true
 *      content: 
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - match_id
 *              - user_id
 *              - powerup_id
 *            properties:
 *              match_id:
 *                type: string
 *                 format: uuid
 *              user_id:
 *                type: string
 *                format: uuid
 *              powerup_id:
 *                type: string
 *                format: uuid
 *    responses:
 *      200:
 *        description: Recorded powerup being used in match by user successfully
 *      404:
 *        description: User, match and/or powerup not found
 *      500:
 *        description: Internal server error
 */
router.post('/powerups/use', usePowerup);

// achievements

/**
 * @swagger
 * /api/achievements:
 *  get:
 *    summary: Gets all achievements
 *    tags: [Achievements]
 *    responses:
 *      200:
 *        description: Successfully retrieved all achievements
 *      500:
 *        Internal server error
 * 
 */
router.get('/achievements', getAchievements);

/**
 * @swagger
 * /api/achievements/user/{user_id}:
 *  get:
 *    summary: Gets all achievements earned by a user
 *    tags: [Achievements]
 *    parameters: 
 *      - in: path
 *        name: user_id
 *        required: true
 *        schema:
 *          type: string
 *          format: uuid
 *    responses:
 *      200:
 *        description: Achievements of specified user retrieved successfully
 *      404:
 *        description: User not found 
 *      500:
 *        description: Internal Server Error
 */
router.get('/achievements/user/:user_id', getUserAchievements);

//for the comment below, because, at least on this branch, achievements haven't been added to the 
// database, i can only assume achievement_id is of uuid format, change if necessary

/** 
 * @swagger
 * /api/achievements/award:
 *  post:
 *    summary: Awards the player with an achievement
 *    tags: [Achievements]
 *    parameters:
 *      - in: path
 *        name: user_id
 *        required: true
 *        schema:
 *          type: string
 *          format: uuid
 *      - in: path
 *        name: achievement_id
 *        required: true
 *        schema:
 *          type: string
 *          format: uuid 
 *    responses:
 *     200:
 *      description: Player awarded with the desired achievement successfully
 *     404:
 *      description: Player not found
 *     500:
 *      description: Internal Server Error
*/
router.post('/submissions/award', awardAchievement);

export default router;