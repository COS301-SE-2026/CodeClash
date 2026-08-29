//Popup that will come whereever the user is (besides in a ranked match) to tell them that someone is inviting them.

import { useFriends } from "../../context/Friends/useFriends";
import { friendContent } from "src/Models/FriendsModel";
import { useMatchmaking } from "src/context/Socket/hooks/useMatchmaking";
import { robot_map } from "src/assets/Robots";
import { UserCircle } from "lucide-react";

function formatCountdown(totalSeconds: number): string { //This will turn a raw number of seconds into a display string of m:s, it helps format how many seconds are left to accept the invite
    const min = Math.floor(totalSeconds/60);
    const sec = totalSeconds % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
}

const FriendInvitePopup = () => {
    const {
        activeInvite, inviteCountdown, inviteError,
        acceptInvite, declineInvite, dismissInviteError,
    } = useFriends();

    const {matched} = useMatchmaking();
    if (matched) return null;

    if (inviteError) {
        return (
            <div className="modal-overlay flex items-center justify-center p-6">
                <div className="modal-panel card-elevated max-w-sm w-full p-8 text-center">
                    <p className="text-danger font-semibold mb-6">{inviteError}</p>
                    <button className="btn btn-secondary w-full" onClick={dismissInviteError} type="button">X</button>
                </div>
            </div>
        )
    }

    if (!activeInvite) return null;
    const names = activeInvite.participants.map((p) => p.name).join(', ');
    const primary = activeInvite.participants[0];

    return (
        <div className="modal-overlay flex items-center justify-center p-6">
            <div className="modal-panel card-glow max-w-sm w-full p-8 text-center">
                <div className="flex flex-col items-center gap-2 mb-6">
                    {primary?.avatar !== undefined ? (
                        <img src={robot_map[primary.avatar]} alt={primary.name} className="avatar w-16 h-16 object-cover mb-2"/>
                    ) : (
                        <div className="avatar w-16 h-16 flex items-center justify-center mb-2">
                            <UserCircle size={32} className="text-muted-text"/>
                        </div>
                    )}
                    <p className="eyebrow">{friendContent.inviteTitle}</p>
                    <h3 className="text-md font-black text-primary-text">{names} wants to play</h3>
                    <p className="text-xsm text-muted-text">This is a casual match, your elo is safe</p>
                </div>
            </div>
        </div>
    )
}
export default FriendInvitePopup;