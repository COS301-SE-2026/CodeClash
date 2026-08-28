import React from "react";
import { useFriends } from "../../ViewModels/FriendsViewModel/useFriends";
import { friendContent } from "../../Models/FriendsModel";
import type { FriendStatus, Relation, Search } from "../../Models/FriendsModel";
import Loading from "../../../@/components/shared/Loading"
import Starfield from "../../../@/components/ui/animations/Starfield";
import { robot_map } from "../../assets/Robots";

const status: Record<FriendStatus, string> = {
    online: 'bg-sucess',
    'playing': 'bg-primary',
    offline: 'bg-muted-text'
}

function timeTracker (iso: string): string {
    const difference = Date.now() - new Date(iso).getTime();

    const mins = Math.floor(difference/60000);
    if (mins < 60) {
        return `${mins}mins ago`;
    }

    const hours = Math.floor(mins/60);
    if (hours < 24) {
        return `${hours}hours ago`;
    }

    const days = Math.floor(hours/24);
    return `${days}days ago`;
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
                                        <img src={robot_map[result.avatar]} alt={result.username} className="avatar w-16 h-16 object-cober shrink-0"/>
                                        <p className="text-primary-text font-semibold truncate flex-1 min-w-0">{result.username}</p>
                                        <RelationResult relationship={result.relationship} onAdd={() => sendFriendRequest(result.id)}/>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </section>
            </div>
        </div>
    )
}

export default Friends;