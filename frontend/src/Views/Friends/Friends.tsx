import React from "react";
import { useFriends } from "../../context/Friends/useFriends";
import { friendContent } from "../../Models/FriendsModel";
import type { FriendStatus, Relation } from "../../Models/FriendsModel";
import Loading from "../../../@/components/shared/Loading"
import Starfield from "../../../@/components/ui/animations/Starfield";
import { robot_map } from "../../assets/Robots";
import { Check, Clock3, Swords, X } from "lucide-react";

const status: Record<FriendStatus, string> = {
    online: 'bg-sucess',
    'playing': 'bg-primary',
    offline: 'bg-muted-text'
}

function timeTracker (iso: string): string {
    const difference = Date.now() - new Date(iso).getTime();

    const mins = Math.floor(difference/60000);
    if (mins < 60) {
        return `${mins}m ago`;
    }

    const hours = Math.floor(mins/60);
    if (hours < 24) {
        return `${hours}h ago`;
    }

    const days = Math.floor(hours/24);
    return `${days}d ago`;
}

const RelationResult: React.FC<{ relationship: Relation; onAdd: () => void}> = ({relationship, onAdd}) => {
    switch (relationship) {
        case 'self': return null;
        case 'friend': 
            return <span className="badge badge-status-correct shrink-0">{friendContent.alreadyFriends}</span>;
        case 'pending-sent':
            return <span className="badge badge-status-pending shrink-0">{friendContent.sendRequestLabel}</span>;
        case 'pending-received':
            return <span className="badge badge-status-pending shrink-0">{friendContent.respondLabel}</span>;
        default:
            return (
                <button className="btn btn-primary btn-sm shirnk-0" onClick={onAdd} type="button">{friendContent.sendRequestLabel}</button>
            )
    }
}

const Friends: React.FC = () => {
    const {
        isLoading, profile, friend, removeFriend, requests, acceptRequest, declineRequest, searchQuery, setSearchQuery, 
        searchResults, sendFriendRequest, sendInvite
    } = useFriends();

    if (isLoading || !profile) {
        return <Loading isOpen={true}/>
    }

    return (
        <div className="relative min-h-[100vh-80px] overflow-hidden">
            <Starfield count={30}/>
            <div className="relative z-10 max-w-2xl mx-auto flex flex-col gap-6">
                {/*A header that gives the user his own details */}
                <div className="card-elevated p-5 flex items-center gap-4">
                    <img src={robot_map[profile.avatar]} alt={profile.username} className="avatar w-16 h-16 object-cover shrink-0"/>
                    <div className="flex-1 min-w-0">
                        <p className="text-primary-text font-black text-md truncate">{profile.username}</p>
                        <p className="text-muted text-sm truncate">{profile.handle}</p>
                    </div>
                </div>

                {/*Search for and add friends */}
                <section>
                    <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5">
                        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={friendContent.searchPlaceholder} 
                            className="bg-transparent outline-none text-sm text-primary-text placeholder:text-muted-text w-full"/>
                    </div>
                    {searchQuery.trim() !== '' && (
                        <div className="flex flex-col gap-3 mt-3">
                            {searchResults.length === 0 ? (
                                <div className="card-elevated empty-state py-8">
                                    <p>{friendContent.searchEmpty}</p>
                                </div>
                            ) : (
                                searchResults.map((result) => (
                                    <div key={result.id} className="card-elevated p-4 flex items-center gap-4">
                                        <img src={robot_map[result.avatar]} alt={result.username} className="avatar w-16 h-16 object-cover shrink-0"/>
                                        <p className="text-primary-text font-semibold truncate flex-1 min-w-0">{result.username}</p>
                                        <RelationResult relationship={result.relationship} onAdd={() => sendFriendRequest(result.id)}/>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </section>

                {/*Friend requests */}
                {requests.length > 0 && (
                    <section>
                        <h2 className="text-md font-bold text-primary mb-3">{friendContent.requestsHeading}</h2>
                        <div className="flex flex-col gap-3">
                            {requests.map((request) => (
                                <div key={request.id} className="card-elevated p-4 flex items-center gap-4">
                                    <img src={robot_map[request.avatar]} alt={request.username} className="avatar w-16 h-16 object-cover shrink-0"/>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-primary-text font-semibold truncate">{request.username}</p>
                                        <p className="text-xsm text-muted">Sent {timeTracker(request.sentAt)}</p>
                                    </div>
                                    <button className="btn btn-primary btn-sm" onClick={() => acceptRequest(request.id)} type="button">
                                        <Check size={16}/>
                                        {friendContent.acceptLabel}
                                    </button>
                                    <button className="btn btn-secondary btn-sm" onClick={() => declineRequest(request.id)} type="button">
                                        <X size={16}/>
                                        {friendContent.declineLabel}
                                    </button>
                                </div> 
                            ))}
                        </div>
                    </section>
                )}

                {/*list of friends */}
                <section>
                    <h2 className="text-md font-bold text-primary mb-3">{friendContent.friendsHeading}</h2>
                    {friend.length === 0 ? (
                        <div className="card-elevated empty-state">
                            <p>{friendContent.friendsEmpty}</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {friend.map((f) => (
                                <div key={f.id} className="card-elevated p-4 flex items-center gap-4">
                                    <div className="relative shrink-0">
                                        <img src={robot_map[f.avatar]} alt={f.username} className="avatar w-16 h-16 object-cover"/>
                                        <span className= {`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${status[f.status]}`}/>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-primary-text font-semibold truncate">{f.username}</p>
                                        <div className="flex items-center gap-1.5 text-sm text-muted">
                                            <span className="score-display text-primary-text text-xsm">{f.elo}</span> {/*Need to add icon here ? */}
                                        </div>
                                    </div>
                                    <button className="btn btn-ghost btn-sm" onClick={() => sendInvite(f.id)} disabled={f.status === 'playing'} 
                                        title={f.status === 'playing' ? 'Already in a match' : undefined} type="button">
                                        {f.status === 'playing' ? <Clock3 size={16}/> : <Swords size={16}/>}
                                        {friendContent.inviteToPlay}
                                    </button>
                                    <button className="btn btn-ghost bg-danger btn-icon" onClick={() => removeFriend(f.id)} 
                                        aria-label= {`${friendContent.removeLabel} ${f.username}`} type="button">
                                        <X size={18}/>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    )
}

export default Friends;