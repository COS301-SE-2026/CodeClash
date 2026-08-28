//Popup that will come whereever the user is (besides in a ranked match) to tell them that someone is inviting them.

import { useLocation } from "react-router-dom";
import { useFriends } from "src/ViewModels/FriendsViewModel/useFriends";
import { friendContent } from "src/Models/FriendsModel";

const matchPaths = ['/math-match', '/prog-match'];

function formatCountdown(totalSeconds: number): string { //This will turn a raw number of seconds into a display string of m:s, it helps format how many seconds are left to accept the invite
    const min = Math.floor(totalSeconds/60);
    const sec = totalSeconds % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
}

const FriendInvitePopup = () => {

}
export default FriendInvitePopup;