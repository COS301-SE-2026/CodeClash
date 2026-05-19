import { EventEmitter } from 'events';

// below event emitter for matchmaking events (singleton, should i change implementation?)
export const matchmakingEvents = new EventEmitter();

export enum MatchmakingEvent {
  USER_ENQUEUED = 'user:enqueued',
  MATCH_FOUND = 'match:found',
  MATCH_NOT_FOUND = 'match:not_found',
  SEARCH_TIMEOUT = 'search:timeout',
}

export interface MatchFoundPayload {
  userId: number;
  opponentId: number;
  matchId: string;
  game_mode: 'math' | 'programming';
}

export interface MatchNotFoundPayload {
  userId: number;
  reason: 'no_compatible_player' | 'timeout';
}