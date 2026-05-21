import UserDto from "../Matchmaking Service/matchmaking.dto";


 
export interface MockUser {
  id: number;
  username: string;
  elo: number;
}
 
export const MOCK_USERS: MockUser[] = [
  { id: 1, username: "morgan", elo: 400 },  
  { id: 2, username: "diso", elo: 900 },
  { id: 3, username: "ntu", elo: 800  },  
  { id: 4, username: "swey", elo: 1200 },
  { id: 5, username: "taskeen", elo: 1250  },  
];



export function getMockUser(id: number): MockUser | undefined {
  return MOCK_USERS.find((u) => u.id === id);
}






//we just put the same user in a math queue and a programming queue so regardless of if programming or math is chosen in demo, immediate match is found
export const MOCK_QUEUE_OPPONENT_MATH: UserDto = {
  id: 3,
  elo: 800,
  game_mode: "math",
  joined_at: Date.now(),
  match_attempt: 1,
};
 
export const MOCK_QUEUE_OPPONENT_PROG: UserDto = {
  id: 3,
  elo: 800,
  game_mode: "programming",
  joined_at: Date.now(),
  match_attempt: 1,
};
 
// the logged in user running the application we simulate on the frontend side. - comesfrom auth session
export const MOCK_CURRENT_USER: MockUser = MOCK_USERS[0]!;
