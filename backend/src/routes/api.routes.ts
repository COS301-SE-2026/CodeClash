import { Router } from 'express';
import { 
  getMatches, 
  getMatchById, 
  createMatch, 
  updateMatchStatus, 
  getMatchLog,
  createMatchLog
} from '../controllers/matches.controllers';
import {
  getUserElo,
  getEloHistory,
  updateEloAfterMatch,
  getLeaderboard
} from '../controllers/elo.controllers';
import {
  getFriendsById,
  getFriendRequests,
  addFriendInvite,
  sendFriendRequest,
  respondToFriendRequest,
  removeFriend
} from '../controllers/friends.controllers';

import{
  createSubmission,
  getSubmissionsByMatch,
  getSubmissionsByUser,
  getSubmissionById,
  updateSubmissionStatus,
  createExecutionResult
}from '../controllers/submissions.controllers'

import{
  getPowerups,
  getMatchPowerups,
  usePowerup,
  getAchievements,
  awardAchievement,
  getUserAchievements
} from '../controllers/powerups.controllers'
const router = Router();

// Match routes

/** 
 * @swagger
 * /api/matches:
 *  get:
 *    summary: Returns a paginated list of matches for the authenticated user. Optionally filter by status or game mode.
 *    tags: [Matches]
 *    parameters: 
 *      - in: query
 *        name: status
 *        required: false
 *        schema:
 *          type: string
 *          enum: [waiting, in_progress, completed, abandonded]
 *        description: Filter matches by status
 *      - in: query
 *        name: mode
 *        required: false
 *        schema:
 *          type: string
 *          enum: [ranked, casual]
 *        description: Filter by game mode
 *      - in: query
 *        name: limit
 *        required: false
 *        schema:
 *          type: int
 *          default: 0
 *        description: Number of matches to return
 *      - in: query
 *        name: offset
 *        required: false
 *        schema: 
 *          type: integer
 *          default: 0
 *        description: Number of matches to skip for pagination
 *    responses:
 *      200:
 *        description: List of matches returned successfully
 *      500: 
 *        description: Internal server error
*/

router.get('/matches', getMatches);
/**
*  @swagger
*  /api/matches/{match_id}:
*    get:
*      summary: Gets single match by its id
*      tags: [Matches]
*      parameters: 
*        - in: path
*          name: match_id
*          required: true
*          schema:
*            type: string
*      responses:
*        200:
*          description: Match found
*        404:
*          description: Match not found
*        500: 
*          description: Internal server error
*/
router.get('/matches/:match_id', getMatchById);
/**
 * @swagger
 * /api/matches:
 *  post:
 *    summary: Creates a match when two people are connected in the queue
 *    tags: [Matches]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - player1_id
 *              - player2_id
 *              - mode
 *              - match_problems_id
 *            properties:
 *              player1_id:
 *                type: string
 *                format: uuid
 *              player2_id:
 *                type: string
 *                format: uuid
 *              mode:
 *                type: string
 *                enum: [ranked, casual]
 *              match_problems_id:
 *                type: string
 *                format: uuid
 *    responses:
 *      201:
 *        description: Match created successfully
 *      500: 
 *        description: Internal server error 
 *          
 */
router.post('/matches', createMatch);
/**
 * @swagger
 * /api/matches/{match_id}/status:
 *  patch:
 *    summary: Updates the status of a match; sets match_start at the beginning of a match
 *    tags: [Matches]
 *    parameters:
 *      - in: path
 *        name: match_id
 *        required: true
 *        schema:
 *          type: string
 *          format: uuid
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required: 
 *              - status
 *            properties:
 *              status:
 *                type: string
 *                enum: [waiting, starting, in_progress, completed, abandonded]
 *    responses:
 *      200:
 *        description: Match status updated successfully
 *      404:
 *        description: Match not found to update status
 *      500:
 *        description: Internal server error
 *      
 */
router.patch('/matches/:match_id/status', updateMatchStatus);
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
router.get('/matches/:match_id/log', getMatchLog);
/**
 * @swagger
 * /api/matches/{match_id}/log:
 *  post:
 *    summary: Creates a match log for a casual match
 *    tags: [Matches]
 *    parameters:
 *      - in: path
 *        name: match_id
 *        required: true
 *        schema:
 *          type: string
 *          format: uuid
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - winner_id
 *              - loser_id
 *            properties:
 *              winner_id:
 *                type: string
 *                format: uuid
 *              loser_id:
 *                type: string
 *                format: uuid
 *    responses:
 *      201:
 *        description: Match log created successfully
 *      500:
 *        description: Internal server error
 */
router.post('/matches/:match_id/log', createMatchLog);

//elo routes
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
router.get('/elo/leaderboard', getLeaderboard);
/**
 * @swagger
 * /api/elo/update:
 *  post:
 *    summary: Update elo ratings for both players after a ranked match
 *    tags: [Elo]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - match_id
 *              - winner_id
 *              - loser_id
 *            properties:
 *              match_id:
 *                type: string
 *                format: uuid
 *              winner_id:
 *                type: string
 *                format: uuid
 *              loser_id:
 *                type: string
 *                format: uuid
 *    responses:
 *      200:
 *        description: Elo ratings updated successfully
 *      400:
 *        description: Missing required fields or match is not ranked
 *      404:
 *        description: Match or player elo rating not found
 *      500:
 *         description: Internal server error
 */
router.post('/elo/update', updateEloAfterMatch);
/**
 * @swagger
 * /api/elo/{user_id}:
 *  get:
 *    summary: Get current elo rating for a user
 *    tags: [Elo]
 *    parameters:
 *      - in: path
 *        name: user_id
 *        required: true
 *        schema:
 *          type: string
 *          format: uuid
 *    responses:
 *      200:
 *        description: Elo rating for use returned successfully
 *      404:
 *        description: Elo rating for user not found
 *      500:
 *        description: Internal server error
 */
router.get('/elo/:user_id', getUserElo);
/**
 * @swagger
 * /api/elo/{user_id}/history:
 *  get:
 *    summary: Get elo rating history for a user
 *    tags: [Elo]
 *    parameters:
 *      - in: path
 *        name: user_id
 *        required: true
 *        schema:
 *          type: string
 *          format: uuid
 *    responses:
 *      200:
 *        description: Elo rating history for use returned successfully
 *      404:
 *        description: Elo rating history for user not found
 *      500:
 *        description: Internal server error
 */
router.get('/elo/:user_id/history', getEloHistory);

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
router.post('/friends/request', sendFriendRequest);
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

//submissions

/**
 * @swagger
 * /api/submissions
 *  post:
 *    summary: Creates a submission
 *    tags: [Submissions]
 *    parameters:
 *      - in: query
 *        name: type
 *        required: true
 *        schema:
 *          type: string
 *          enum: [math, programming]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - user_id
 *              - match_id
 *              - problem_id
 *              - entry
 *            properties:
 *              user_id:
 *                type: string
 *                format: uuid
 *              match_id:
 *                type: string
 *                format: uuid
 *              problem_id:
 *                type: string
 *                format: uuid
 *              entry:
 *                type: string
 *                enum: [mathsText, codeText]
 *    responses:
 *      200:
 *        description: Submission successfully created
 *      500:
 *        description: Internal server error
 */
router.post('/submissions', createSubmission);
/**
 * @swagger
 * /api/submissions/match/{match_id}
 *  get:
 *    summary: Gets all submissions of a specified match
 *    tags: [Submissions]
 *    parameters:
 *      - in: path
 *        name: match_id
 *        required: true
 *        schema:
 *          type: string
 *          format: uuid
 *    responses:
 *      200:
 *        description: Found all submissions of the specified match
 *      404:
 *        description: Match not found
 *      500:
 *        description: Internal server error
 * 
 *  
 */
router.get('/submissions/match/:match_id', getSubmissionsByMatch);
/**
 * @swagger
 * /api/submissions/user/{user_id}
 *  get:
 *    summary: Gets submissions by a user
 *    tags: [Submissions]
 *    parameters:
 *      - in: path
 *        name: user_id
 *        required: true
 *        schema:
 *          type: string
 *          format: uuid
 *    responses:
 *      200:
 *        description: Found submissions of specified user successfully
 *      404:
 *        description: User not found
 *      500:
 *        description: Internal server error
 */
router.get('/submissions/user/:user_id', getSubmissionsByUser);
/**
 * @swagger
 * /api/submissions/{submission_id}
 *  get:
 *    summary: Gets a submission by its id
 *    tags: [Submissions]
 *    parameters:
 *      - in: path
 *        name: submission_id
 *        required: true
 *        schema:
 *          type: string
 *          format: uuid
 *    responses:
 *      200:
 *        description: Found submission by given id successfully
 *      404:
 *        description: Submission not found
 *      500:
 *        description: Internal server error
 */
router.get('/submissions/:submission_id', getSubmissionById);
/**
 * @swagger
 * /api/submission/{submission_id}/status
 *  patch:
 *    summary: Updates status of submission
 *    tags: [Submissions]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - status
 *              - submission_id
 *            properties:
 *              status:
 *                type: string
 *                enum: [waiting, starting, in_progress, completed, abandoned]
 *    responses:
 *      200:
 *        description: Updated status of submission successfully
 *      404:
 *        description: Submission or its status not found
 *      500:
 *        description: Internal server error
 */
router.patch('/submissions/:submission_id/status', updateSubmissionStatus);
/**
 * @swagger
 * /api/submissions/{submission_id}/result
 *  post:
 *    summary: Create the result of the execution of a submission
 *    tags: [Submissions]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - submission_id
 *              - passed_cases
 *              - total_cases
 *              - execution_time
 *              - memory_used
 *              - error_message
 *            properties:
 *              submission_id:
 *                type: string
 *                format: uuid
 *              passed_cases:
 *                type: number
 *                format: integer
 *              total_cases:    
 *                type: number
 *                format: integer
 *              execution_time:
 *                 type: number
 *                 format: integer
 *              memory_used:
 *                 type: number
 *                 format: integer
 *              error_message:
 *                 type: string
 *                 format: text
 *    responses:
 *      200:  
 *        description: Result created after execution successfully
 *      404:
 *        description: Submission not found
 *      500:
 *        description: Internal server error
 *              
 *          
 */
router.post('/submissions/:submission_id/result', createExecutionResult);

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