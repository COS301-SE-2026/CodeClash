import { Router } from 'express';
import { 
  getMatches, 
  getMatchById, 
  createMatch, 
  updateMatchStatus, 
  getMatchLog 
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
router.get('/matches', getMatches);
router.get('/matches/:match_id', getMatchById);
router.post('/matches', createMatch);
router.patch('/matches/:match_id/status', updateMatchStatus);
router.get('/matches/:match_id/log', getMatchLog);

//elo routes
router.get('/elo/leaderboard', getLeaderboard);
router.post('/elo/update', updateEloAfterMatch);
router.get('/elo/:user_id', getUserElo);
router.get('/elo/:user_id/history', getEloHistory);

//friends routes
router.get('/friends/requests/:user_id', getFriendRequests);
router.post('/friends/invite', addFriendInvite);
router.post('/friends/request', sendFriendRequest);
router.patch('/friends/request/:friendship_id', respondToFriendRequest);
router.get('/friends/:user_id', getFriendsById);
router.delete('/friends/:friendship_id', removeFriend);

//submissions
router.post('/submissions', createSubmission);
router.get('/submissions/match/:match_id', getSubmissionsByMatch);
router.get('/submissions/user/:user_id', getSubmissionsByUser);
router.get('/submissions/:submission_id', getSubmissionById);
router.patch('/submissions/:submission_id/status', updateSubmissionStatus);
router.post('/submissions/:submission_id/result', createExecutionResult);

// powerups
router.get('/powerups', getPowerups);
router.get('/powerups/match/:match_id', getMatchPowerups);
router.post('/powerups/use', usePowerup);

// achievements
router.get('/achievements', getAchievements);
router.get('/achievements/user/:user_id', getUserAchievements);
router.post('/submissions/award', awardAchievement);

export default router;