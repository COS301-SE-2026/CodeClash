//This will read shared data from FriendsContext and be called by other files like the Friends.tsx and FriendInvites popup. 

import { useContext } from "react";
import { FriendsContextFunc } from "./FriendsContext";

export function useFriends() {
    const context = useContext(FriendsContextFunc);

    if (!context) {
        throw new Error('Must be used within a FriendsProvider')
    }

    return context;
}