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


  



 useEffect(() => {
    // join queue
    send({ type: "JOIN", userId, gameMode });


    // listen for bridge response
    const unsubscribe = subscribe((msg) => {
      if (msg.type === "MATCHED") {
        onMatched(msg.match);
      } else if (msg.type === "WAITING") {
        onWaiting?.();
      } else if (msg.type === "ERROR") {
        onError?.(msg.message);
      }
    });



    // On unmount (user navigates away or cancels) — leave the queue
    return () => {
      send({ type: "LEAVE", userId });
      unsubscribe();
    };
  }, [userId, gameMode]);



  return { cancel };
}

