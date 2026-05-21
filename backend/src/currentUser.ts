//N.B. !!!!!


//this interface and function are just going to be used to mock the details of the
//"current" user who is live and actively moving through the pages (simulating a real user)
//(replace when login is completed)
export interface CurrentUser {
  id: number;
  username: string;
  elo: number;
}
 


//returns this mock "currently logged in",live demo user - must rplace these details later
//when login details are provided from cognito, replace the body below with
//"const {user} = useAuth();
// return user;"
export function useCurrentUser(): CurrentUser {
  return {
    id: 2,
    username: "diso",
  elo: 900,
 
  };
}
