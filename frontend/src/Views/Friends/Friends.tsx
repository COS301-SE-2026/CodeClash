import React from "react";
import { useFriends } from "src/ViewModels/FriendsViewModel/useFriends";
import { friendContent } from "src/Models/FriendsModel";
import type { FriendStatus, Relation, Search } from "src/Models/FriendsModel";

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
            return <span className="badge badge-status-pending shirnk-0">{friendContent.sendRequestLabel}</span>;
        case 'pending-received':
            return <span className="badge badge-status-pending shrink-0">{friendContent.respondLabel}</span>;
        default:
            return (
                <button className="btn btn-primary btn-sm shirnk-0" onClick={onAdd} type="button">{friendContent.sendRequestLabel}</button>
            )
    }
}

const Friends: React.FC = () => {

}

export default Friends;