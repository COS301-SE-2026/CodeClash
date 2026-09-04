import React, { useEffect, useRef, useState } from "react";
import { useFriends } from "../../context/Friends/useFriends";
import { friendContent } from "../../Models/FriendsModel";
import type { FriendStatus, Relation } from "../../Models/FriendsModel";
import Loading from "../../../@/components/shared/Loading"
import Starfield from "../../../@/components/ui/animations/Starfield";
import { robot_map } from "../../assets/Robots";
import { Check, Clock3, Search, Swords, X } from "lucide-react";
import { useExtraLayout } from "src/extra-layout";

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

const RelationResult: React.FC<{ relationship: Relation; onAdd: () => void; isPending?: boolean}> = ({relationship, onAdd, isPending}) => {
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
                <button 
                    className={`btn btn-primary btn-sm shirnk-0 transition-all duration-200 ${isPending ? 'btn-ghost opacity-50' : 'btn-primary'}`}
                        onClick={onAdd} 
                        type="button">
                        {isPending ? 'Sending...' : friendContent.sendRequestLabel}
                        </button>
            )
    }
}

const Friends: React.FC = () => {
    const {
        isLoading, profile, error, friend, removeFriend, requests, acceptRequest, declineRequest, searchQuery, setSearchQuery, 
        allUsers, sendFriendRequest
    } = useFriends();

    const [isDropDownOpen, setIsDropDownOpen] = useState(false);
    const [tooltipId, setTooltipId] = useState<string | null>(null);
    const tooltipTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const searchRef = useRef<HTMLDivElement>(null);
    const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());

    const handleSendRequest = async (id: string) => {
        setPendingIds(prev => new Set(prev).add(id));
        await sendFriendRequest(id);
        setPendingIds(prev => { const next = new Set(prev); next.delete(id); return next; });
    }
    const showTooltip = (id: string) => {
        setTooltipId(id);
        if (tooltipTimeout.current) clearTimeout(tooltipTimeout.current);
        tooltipTimeout.current = setTimeout(() => setTooltipId(null), 2500);
    };

    useEffect(() => {
        const handleClickOutside  = (e:MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setIsDropDownOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const showDropdown = isDropDownOpen && searchQuery.trim() != '';

    useExtraLayout(
        <div ref={searchRef} className="relative w-full">
            <div className="flex items-center gap-2 w-full rounded-full border border-border bg-card px-4 py-2.5">
                <Search size={18} className="text-muted-text shrink-0"/>
                <input type="text" value={searchQuery} onChange={(e) => {setSearchQuery(e.target.value); setIsDropDownOpen(true);}}
                    onFocus={() => setIsDropDownOpen(true)} placeholder={friendContent.searchPlaceholder} className="bg-transparent outline-none text-xsm text-primary-text placeholder:text-muted-text w-full"
                />
            </div>
            {showDropdown && (
                <div className="absolute top-full left-0 mt-2 w-full max-h-80 overflow-y-auto p-2 flex flex-col gap-2 z-50 rounded-2xl border border-border backdrop-blur-md bg-card/90 shadow-lg">
                    {allUsers.length === 0 ? (
                        <div className="empty-state py-6">
                            <p className="text-sm text-danger">{friendContent.searchEmpty}!</p>
                        </div>
                    ) : (
                        allUsers.map((result) => (
                            <div key={result.id} className="p-2 rounded-full flex items-center gap-3 hover:bg-background-elevated">
                                <img src={robot_map[result.avatar]} alt={result.username} className="avatar w-10 h-10 object-cover shrink-0"/>
                                <p className="text-primary-text text-sm font-semibold truncate flex-1 min-w-0">{result.username}</p>
                                <RelationResult relationship={result.relationship} onAdd={() => handleSendRequest(result.id)} isPending={pendingIds.has(result.id)}/>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    )

    if (isLoading || !profile) {
        return <Loading isOpen={true}/>
    }
    {error && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-danger/10 border border-danger/30 text-xsm text-danger text-center">
            {error}
        </div>
    )}
    return (
        <div className="relative min-h-[100vh-80px] overflow-hidden">
            <Starfield count={30}/>
            <div className="relative z-10 max-w-2xl mx-auto flex flex-col gap-6">
                {/*A header that gives the user his own details */}
                <div className="card-elevated p-5 flex items-center gap-4">
                    <img src={robot_map[profile.avatar]} alt={profile.username} className="avatar w-16 h-16 object-cover shrink-0"/>
                    <div className="flex-1 min-w-0">
                        <p className="text-primary-text font-black text-md truncate">{profile.username}</p>
                        <p className="text-muted text-sm truncate">@{profile.handle}</p>
                    </div>
                </div>

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
                                    {/* return when casual gaming is implemented */}
                                    {/* <button className="btn btn-ghost btn-sm" onClick={() => sendInvite(f.id)} disabled={f.status === 'playing'} 
                                        title={f.status === 'playing' ? 'Already in a match' : undefined} type="button">
                                        {f.status === 'playing' ? <Clock3 size={16}/> : <Swords size={16}/>}
                                        {friendContent.inviteToPlay}
                                    </button> */}
                                    <div className="relative">
                                        <button
                                            className="btn btn-ghost btn-sm"
                                            onClick={() => showTooltip(f.id)}
                                            type="button"
                                         >
                                            {f.status === 'playing' ? <Clock3 size={16}/> : <Swords size={16}/>}
                                            {friendContent.inviteToPlay}
                                        </button> 
                                        {tooltipId === f.id && (
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-x1 bg-card border border-border text-xsm tex-primary-text whitespace-nowrap z-50 shadow-lg">
                                                Casual gaming coming soon!
                                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-card"/>
                                            </div>
                                        )}  
                                    </div>
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