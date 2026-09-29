//Popup that will come whereever the user is (besides in a ranked match) to tell them that someone is inviting them.

import { Clock, UserCircle } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { robot_map } from "src/assets/Robots";
import { useMatchmaking } from "src/context/Matchmaking/hooks/useMatchmaking";
import { friendContent } from "src/Models/FriendsModel";

import { useFriends } from "../../context/Friends/useFriends";

function formatCountdown(totalSeconds: number): string { //This will turn a raw number of seconds into a display string of m:s, it helps format how many seconds are left to accept the invite
    const min = Math.floor(totalSeconds/60);
    const sec = totalSeconds % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
}

const FriendInvitePopup = () => {
    const {
        activeInvite, inviteCountdown, inviteError,
        acceptInvite, declineInvite, dismissInviteError,
        matchReady, clearMatchReady, notice
    } = useFriends();

    const {matched} = useMatchmaking();
    const nav = useNavigate();

    useEffect(() => {
        if (matchReady) {
            clearMatchReady();
            nav('/match-found');
        }
    }, [matchReady, clearMatchReady, nav]);
 
    const noticeToast = notice ? (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] px-4 py-3 rounded-xl bg-primary/10 border border-primary/30 text-xsm text-primary text-center shadow-lg">
            {notice}
        </div>
    ) : null;
    if (matched) return noticeToast;

    if (inviteError) {
        return (
            <>
                {noticeToast}
                <div className="modal-overlay flex items-center justify-center p-6">
                    <div className="modal-panel card-elevated max-w-sm w-full p-8 text-center">
                        <p className="text-danger font-semibold mb-6">{inviteError}</p>
                        <button className="btn btn-secondary w-full" onClick={dismissInviteError} type="button">X</button>
                    </div>
                </div>
            </>
        )
    }

    if (!activeInvite) return noticeToast;
    const names = activeInvite.participants.map((p) => p.name).join(', ');
    const primary = activeInvite.participants[0];

    return (
        <>
        {noticeToast}
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

                <div className="flex items-center justify-center gap-2 text-muted mb-6">
                    <Clock size={16}/>
                    <span className="score-display text-lg text-primary">{formatCountdown(inviteCountdown)}</span>
                    <span className="text-sm">remaining</span>
                </div>

                <div className="flex gap-3">
                    <button className="btn btn-secondary flex-1" onClick={declineInvite} type="button">{friendContent.declineLabel}</button>
                    <button className="btn btn-primary flex-1" onClick={acceptInvite}type="button">{friendContent.inviteAcceptLabel}</button>
                </div>
            </div>
        </div>
        </>
    )
}
export default FriendInvitePopup;