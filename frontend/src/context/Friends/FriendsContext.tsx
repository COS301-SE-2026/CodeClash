import {
    createContext, useCallback, useEffect, 
    useMemo, useRef, useState,
} from "react";
import { useSocket } from "src/context/Socket/hooks/useSocket";

import { useAuth } from "../Auth/hooks/useAuth";
import {friendContent} from "../../Models/FriendsModel";
import type {
    Friend, FriendRequest, Invite, 
    Search, Summary, Relation
} from "../../Models/FriendsModel";


const API_BASE = '/api'; 
const INVITE_EXPIRY = 10 * 60 * 1000; 

interface FriendsContext {
    isLoading: boolean;
    profile: Summary | null;
    error: string | null;
    notice: string | null;
    friend: Friend[];
    removeFriend: (id: string) => void;

    requests: FriendRequest[];
    requestCount: number;
    acceptRequest: (id: string) => void;
    declineRequest: (id: string) => void;

    searchQuery: string;
    setSearchQuery: (query: string) => void;
    allUsers: Search[];
    sendFriendRequest: (id: string) => void;

    sendInvite: (id: string) => void;
    activeInvite: Invite | null;
    inviteCountdown: number,
    inviteError: string | null;
    acceptInvite: () => void;
    declineInvite: () => void;
    dismissInviteError: () => void;

    matchReady: boolean;
    clearMatchReady: () => void;
}
// eslint-disable-next-line react-refresh/only-export-components
export const FriendsContextFunc = createContext<FriendsContext | null>(null);

export const FriendsProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const {token, user} = useAuth();
    const { friendsSocket} = useSocket();
    const [isLoading, setIsLoading] = useState(true);
    const [profile, setProfile] = useState<Summary | null>(null);
    const [friend, setFriend] = useState<Friend[]>([]);
    const [requests, setRequests] = useState<FriendRequest[]>([]);
    const [sentRequest, setSentRequest] = useState<Set<string>>(new Set());
    const [searchQuery, setSearchQuery] = useState('');
    const [activeInvite, setActiveInvite] = useState<Invite | null>(null);
    const [inviteError, setInviteError] = useState<string | null>(null);
    const [now, setNow] = useState(() => Date.now());
    const [allUsers, setAllUsers] = useState<Search[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [notice, setNotice] =useState<string | null>(null);
    const [matchReady, setMatchReady] = useState(false);

    const friendsRef = useRef(friend); //this is so closures dont capture a stale list
    friendsRef.current = friend;

    const requestsRef = useRef(requests); // so socket handlers don't capture a astale requests list
    requestsRef.current = requests;

    const profileRef= useRef(profile);
    profileRef.current = profile;

    const activeInviteRef = useRef(activeInvite);
    activeInviteRef.current = activeInvite;

    const activeInviteIdRef = useRef<string | null>(null); //tracks the current id for Invites, so we can differentiate same invite to new invite without resetting local countdown

    const showNotice = useCallback((message: string) => {
        setNotice(message);
        setTimeout(() => setNotice((prev) => prev === message ? null : prev), 4000);
    }, []);

        const fetchAll = useCallback(async () => {
            if(!token) return;
            try {
                const [friendsRes, requestRes] = await Promise.all([
                    fetch(`${API_BASE}/friends`, { headers: { Authorization: `Bearer ${token}` } }),
                    fetch(`${API_BASE}/friends/requests?type=received`, { headers: { Authorization: `Bearer ${token}` } })
                ]);
                const friendsData = friendsRes.ok ? await friendsRes.json() : [];
                const requestsData = requestRes.ok ? await requestRes.json() : [];

                setFriend(friendsData.map((f: any) => ({
                    id: f.user_id,
                    friendship_id: f.friendship_id,
                    username: f.username,
                    avatar: f.avatar_id ?? 0,
                    status: 'offline' as const, // status not stored in DB, defailt offline
                    elo: f.elo ?? 600
                })));

                setRequests(requestsData.map((r: any) => ({
                    id: r.friendship_id,
                    username: r.username,
                    avatar: r.avatar_id ?? 0,
                    sentAt: r.created_at,
                    fromUser: r.user_id
                })));

                // build profile from auth user
                if (user && token) {
                    try {
                        const [avatarRes, leagueRes] = await Promise.all([
                            fetch(`${API_BASE}/user/avatar_id`, {headers: { Authorization: `Bearer ${token}` }}),
                            fetch(`${API_BASE}/user/league`, {headers: { Authorization: `Bearer ${token}` }}),
                        ]);
                        const avatarData = avatarRes.ok ? await avatarRes.json() : null;
                        const leagueData = leagueRes.ok ? await leagueRes.json() : null;

                        setProfile({
                            id: user.userId ?? '',
                            username: user.username ?? '',
                            avatar: avatarData?.avatar_id ?? 0,
                            league: leagueData?.league ?? 'Mercury',
                            handle: user.username ?? ''
                        });
                        
                    } catch (err) {
                        console.error('Error fetching profile data:', err);
                        setError('Failed to load friend. Please try again');
                    }
                }
            }catch(err){
                console.error('Error fetching friends data:', err);
                setError('Failed to load friends. Please try again.');
            } finally {
                setIsLoading(false);
            }
        }, [token, user]); //end fetchAll
   
    useEffect(()=> {
        if(!token) return;
        fetchAll();
        const interval = setInterval(fetchAll, 30_000);
        return () => clearInterval(interval);
    }, [fetchAll, token]);//end useEffect

    /*GET /api/friend/invite for an incoming friend invite */
    useEffect(() => {
        if (!activeInvite) return;
        const interval = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(interval);
    }, [activeInvite]);

    useEffect(() => {
        if (activeInvite && now - activeInvite.expires >= INVITE_EXPIRY) {
            activeInviteIdRef.current = null;
            setActiveInvite(null);
        }
    }, [activeInvite, now])

    const inviteCountdown = useMemo(() => {
        if (!activeInvite) {
            return 0;
        }
        const remaining = INVITE_EXPIRY - (now - activeInvite.expires);
        return Math.max(0, Math.ceil(remaining/1000));
    }, [activeInvite, now]);

    /*SEARCH */
    useEffect(() => {
        if(!token || searchQuery.trim().length < 2 ) {
            setAllUsers([]);
            return;
        }
        const timeout = setTimeout(async () => {
            try {
                const res = await fetch(`${API_BASE}/user/search?q=${encodeURIComponent(searchQuery)}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = res.ok ? await res.json() : [];

                const friendIds = new Set(friend.map((f) => f.id));
                const incomingReqs = new Set(requests.map((r) => r.fromUser));

                setAllUsers(data.map((u: any): Search => {
                    let relationship: Relation = 'none';
                    if (u.user_id === profile?.id) relationship = 'self';
                    else if (friendIds.has(u.user_id)) relationship = 'friend';
                    else if (sentRequest.has(u.user_id)) relationship = 'pending-sent';
                    else if (incomingReqs.has(u.user_id)) relationship = 'pending-received';
                    return {
                        id: u.user_id,
                        username: u.username,
                        avatar: u.avatar_id ?? 0,
                        relationship
                    };
                }));
            } catch {
                setAllUsers([]);
            }
        }, 300); // debounce
        return () => clearTimeout(timeout);
    }, [searchQuery, token, friend, requests, sentRequest, profile]);

    const sendFriendRequest = useCallback(async (id: string) => {
        if(!token) return;
        try{
            const res = await fetch(`${API_BASE}/friends/request`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ receiver_id: id })
            });

            if (!res.ok) {
                const err = await res.json();
                if (err.message?.includes('24 hours')) {
                    setError('You need to wait 24 hours before sending another request to this person.');
                    setTimeout(() => setError(null), 4000);
                    return;
                }
            }

            setSentRequest((prev) => new Set(prev).add(id));
            friendsSocket?.sendFriendRequest({ receiver_id: id, from_username: user?.username ?? '' });
            await fetchAll();
        } catch (err) {
            console.error('Error sending friends request:', err);
        }
    }, [token, fetchAll, friendsSocket, user]);

    /*Requests - needs accept and decline endpoint */
    const acceptRequest = useCallback( async (id: string) => {
        if(!token) return;
        const req = requests.find((r) => r.id === id);
        if (!req) {
            return;
        }
        try {
            await fetch(`${API_BASE}/friends/request/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ status: 'accepted' })
            });
            setRequests((prev) => prev.filter((r) => r.id !== id));
            setFriend((prev) => [
                ...prev, {
                    id: req.fromUser, 
                    friendship_id: req.id,
                    username: req.username,
                    avatar: req.avatar,
                    status: 'offline',
                    elo: 600
                }
            ]);
            friendsSocket?.respondFriendRequest({ requester_id: req.fromUser, status: 'accepted' });
        } catch (err) {
            console.error('Error accepting friend request:', err);
        }
        await fetchAll();
    }, [token, requests, friendsSocket])

    const declineRequest = useCallback( async (id: string) => {
        if (!token) return;
        const req =  requests.find((r) => r.id === id);
        try{
            await fetch(`${API_BASE}/friends/request/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ status: 'declined' })
            });
            setRequests((prev) => prev.filter((r) => r.id !== id));
            if (req) friendsSocket?.respondFriendRequest({ requester_id: req.fromUser, status: 'declined' })
        } catch (err) {
            console.error('Error declining friend request:', err);
        }
        await fetchAll();
    }, [token, requests, friendsSocket])

    const removeFriend = useCallback( async (friendship_id: string) => {
        if (!token) return;
        try{
            await fetch(`${API_BASE}/friends/${friendship_id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            await fetchAll();
        } catch (err) {
            console.error('Error removing friend:', err);
        }
    }, [token, fetchAll]);

    /*Invites */
    const sendInvite = useCallback(async (friendId: string) => {
        const target = friendsRef.current.find((f) => f.id === friendId);
        if (!target || !token || !user) {
            return;
        }
        try {
            const res = await fetch(`${API_BASE}/friends/invite`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ user_id: user.userId })
            });
            const invite = await res.json();

            friendsSocket?.sendPlayInvite({
                receiver_id: friendId,
                invite: {
                    id: invite?.invite_code ?? crypto.randomUUID(),
                    mode: 'casual',
                    participants: [{
                        name: user.username ?? '',
                        elo: 600, // TODO expose real elo to Summary/auth user
                        friendId: user.userId,
                        avatar: profileRef.current?.avatar,
                        status: 'online'
                    }],
                    expires: Date.now(),
                }
            });

        } catch (err) {
            console.error('Error sending invite:', err);
        }
    }, [token, user, friendsSocket])

    const acceptInvite = useCallback(() => {
        if (!activeInvite) {
            return;
        }
        const senderPlaying = activeInvite.participants.some((p) => p.status === 'playing');
        if (senderPlaying) {
            setInviteError(friendContent.inviteInvalid);
            activeInviteIdRef.current = null;
            setActiveInvite(null);
            return;
        }
        const sender_id = activeInvite.participants[0]?.friendId;
        if (sender_id) {
            friendsSocket?.respondPlayInvite({ sender_id, invite_id: activeInvite.id, accepted: true });
        }
        activeInviteIdRef.current = null;
        setActiveInvite(null);
        setMatchReady(true);
    }, [activeInvite, friendsSocket])

    const declineInvite = useCallback(() => {
        if (activeInvite) {
            const sender_id = activeInvite.participants[0]?.friendId;
            if (sender_id) {
                friendsSocket?.respondPlayInvite({ sender_id, invite_id: activeInvite.id, accepted: false });
            }
        }
        activeInviteIdRef.current = null;
        setActiveInvite(null);
    }, [activeInvite, friendsSocket])

    const dismissInviteError = useCallback(() => setInviteError(null), []);

    const clearMatchReady = useCallback(()=> setMatchReady(false), []);

    /*Real time listeners */
    useEffect(() => {
        if(!friendsSocket) return;

        const unsub_request_received = friendsSocket.friendRequestReceived((data) => {
            showNotice(`${data.from_username} sent you a friend request`);
            void fetchAll();
        });

        const unsub_request_responded = friendsSocket.friendRequestResponded((data) => {
            showNotice(
                data.status === 'accepted'
                ? `${data.from_username} accepted your friend request`
                : `${data.from_username} declined your friend request`
            );
            setSentRequest((prev) => {
                const next = new Set(prev);
                next.delete(data.from_user_id);
                return next;
            });
            void fetchAll();
        });
        const unsub_invite_received = friendsSocket.playInviteReceived((invite) => {
            activeInviteIdRef.current = invite.id;
            setActiveInvite(invite);
        });

        const unsub_invite_responded = friendsSocket.playInviteResponded((data) => {
            if(data.accepted) {
                showNotice('Your friend accepted. Starting match');
                setMatchReady(true);
            }else {
                showNotice('Your friend declined the invite');
            }
        });

        return () => {
            unsub_request_received();
            unsub_request_responded();
            unsub_invite_received();
            unsub_invite_responded();
        };
    }, [friendsSocket, fetchAll, showNotice]);

    const value: FriendsContext = {
        isLoading,
        profile,
        error,
        notice,
        friend,
        removeFriend,

        requests,
        requestCount: requests.length,
        acceptRequest,
        declineRequest,

        searchQuery,
        setSearchQuery,
        allUsers,
        sendFriendRequest,

        sendInvite,
        activeInvite,
        inviteCountdown,
        inviteError,
        acceptInvite,
        declineInvite,
        dismissInviteError,

        matchReady,
        clearMatchReady,
    };

    return (
        <FriendsContextFunc.Provider value={value}>
            {children}
        </FriendsContextFunc.Provider>
    );
};