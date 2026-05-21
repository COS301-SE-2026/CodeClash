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


