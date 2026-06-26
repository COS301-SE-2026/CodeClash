import { Router } from 'express';
import { getMatches, getMatchById, createMatch, updateMatchStatus, getMatchLog } from '../controllers/matches.controllers';
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
  respondToFriendRequest
} from '../controllers/friends.controllers';

const router = Router();

// Match routes
router.get('/matches', getMatches);
router.get('/matches/:match_id', getMatchById);
router.post('/matches', createMatch);
router.patch('/matches/:match_id/status', updateMatchStatus);
router.get('/matches/:match_id/log', getMatchLog);

//elo routes
router.get('/elo/leaderboard', getLeaderboard);
router.get('/elo/:user_id', getUserElo);
router.get('/elo/:user_id/history', getEloHistory);
router.post('/elo/update', updateEloAfterMatch);

//friends routes
router.get('/friends/requests/:user_id', getFriendRequests);
router.get('/friends/:user_id', getFriendsById);
router.post('/friends', addFriendInvite);
router.post('/friends', sendFriendRequest);
router.post('/friends', respondToFriendRequest);

export default router;