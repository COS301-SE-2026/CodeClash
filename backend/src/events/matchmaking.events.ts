import { EventEmitter } from "events";
import UserDto, { MatchDto } from "../Matchmaking Service/matchmaking.dto";
 


export interface MatchmakingEvents {
  "player:joined": (user: UserDto) => void; //player entered queue
  "player:left": (userId: number, queue: string) => void;

  "match:searching": (user: UserDto) => void; //matchmaking function ran but found no opponent yet
  "match:found": (player1Id: number, player2Id: number) => void; //two players were found to be paired of r a match
  "match:created": (match: MatchDto) => void;

}



class MatchmakingEventBus extends EventEmitter {
  emit<K extends keyof MatchmakingEvents>( //extends keyof means that only one of the parameters of Matchmaking events
    event: K,
    ...args: Parameters<MatchmakingEvents[K]>
  ): boolean {
    return super.emit(event, ...args);
  }
  on<K extends keyof MatchmakingEvents>(
    event: K,
    listener: MatchmakingEvents[K]
  ): this {
    return super.on(event, listener as (...args: unknown[]) => void);
  }

}