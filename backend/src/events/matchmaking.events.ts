import { EventEmitter } from "events";
import UserDto, { MatchDto } from "../Matchmaking Service/matchmaking.dto";
 


export interface MatchmakingEvents {
  "player:joined": (user: UserDto) => void; //player entered queue
  "player:left": (userId: number, queue: string) => void;
}