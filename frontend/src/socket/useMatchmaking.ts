import { useEffect, useCallback } from 'react';
import { send, subscribe } from "./socket";
import type { GameMode, MatchData } from "../../../backend/src/Matchmaking Service/matchmaking.dto";




export function useMatchmaking({
  userId,
  gameMode,
  onMatched,
  onWaiting,
  onError,
}: UseMatchmakingOptions): { cancel: () => void } {
  const cancel = useCallback(() => {
    send({ type: "LEAVE", userId });
  }, [userId]);
