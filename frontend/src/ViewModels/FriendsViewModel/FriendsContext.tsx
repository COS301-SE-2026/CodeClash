import {
    createContext, useCallback, useEffect, 
    useMemo, useRef, useState,
} from "react";

import {friendContent} from "../../Models/FriendsModel";
import type {
    Friend, FriendRequest, Invite, GameInvite, 
    Search, Summary
} from "../../Models/FriendsModel";

import { useAuth } from "../../context/Auth/hooks/useAuth";
import { Socket } from "socket.io-client";
import { useSocket } from "src/context/Socket/hooks/useSocket";

const API_BASE = '/api'; 
const INVITE_EXPIRY = 10 * 60 * 1000; 

interface FriendsContext {
    isLoading: boolean;
    profile: Summary | null;
    error: string | null;
    friend: Friend[];
    removeFriend: (id: string) => void;

    requests: FriendRequest[];
    requestCount: number;
    acceptRequest: (id: string) => void;
    declineRequest: (id: string) => void;

    searchQuery: string;
    setSearchQuery: (query: string) => void;
    allUsers: Omit<Search, 'relationship'>[];
    sendFriendRequest: (id: string) => void;

    sendInvite: (id: string) => void;
    activeInvite: Invite | null;
    inviteCountdown: number,
    inviteError: string | null;
    acceptInvite: () => void;
    declineInvite: () => void;
    dismissInviteError: () => void;
}

export const FriendsContextFunc = createContext<FriendsContext | null>(null);

export const FriendsProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const {token, user} = useAuth();
    const { socket } = useSocket();
    const [isLoading, setIsLoading] = useState(true);
    const [profile, setProfile] = useState<Summary | null>(null);
    const [friend, setFriend] = useState<Friend[]>([]);
    const [requests, setRequests] = useState<FriendRequest[]>([]);
    const [sentRequest, setSentRequest] = useState<Set<string>>(new Set());
    const [searchQuery, setSearchQuery] = useState('');
    const [activeInvite, setActiveInvite] = useState<Invite | null>(null);
    const [inviteError, setInviteError] = useState<string | null>(null);
    const [now, setNow] = useState(() => Date.now());
    const [allUsers, setAllUsers] = useState<Omit<Search, 'relationship'>[]>([]);
    const [error, setError] = useState<string | null>(null);

    const friendsRef = useRef(friend); //this is so closures dont capture a stale list
    friendsRef.current = friend;

    const activeInviteIdRef = useRef<string | null>(null); //tracks the current id for Invites, so we can differentiate same invite to new invite without resetting local countdown

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
                setAllUsers(data.map((u: any) => ({
                    id: u.user_id,
                    username: u.username,
                    avatar: u.avatar_id ?? 0
                })));
            } catch {
                setAllUsers([]);
            }
        }, 300); // debounce
        return () => clearTimeout(timeout);
    }, [searchQuery, token]);

    const sendFriendRequest = useCallback(async (id: string) => {
        if(!token) return;
        try{
            await fetch(`${API_BASE}/friends/request`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ receiver_id: id })
            });
            setSentRequest((prev) => new Set(prev).add(id))
        } catch (err) {
            console.error('Error sending friends request:', err);
        }
        await fetchAll();
    }, [token]);

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
                    username: req.username,
                    avatar: req.avatar,
                    status: 'offline',
                    elo: 600
                }
            ]);
        } catch (err) {
            console.error('Error accepting friend request:', err);
        }
        await fetchAll();
    }, [token, requests])

    const declineRequest = useCallback( async (id: string) => {
        if (!token) return;
        try{
            await fetch(`${API_BASE}/friends/request/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ status: 'declined' })
            });
            setRequests((prev) => prev.filter((r) => r.id !== id));
        } catch (err) {
            console.error('Error declining friend request:', err);
        }
        await fetchAll();
    }, [token])

    const removeFriend = useCallback( async (id: string) => {
        if (!token) return;
        const f = friend.find((fr) => fr.id === id);
        if(!f) return;
        try{
            // need to find a way to retrieve friendship_id
            setFriend((prev) => prev.filter((r) => r.id !== id));
        } catch (err) {
            console.error('Error removing friend:', err);
        }
        await fetchAll();
    }, [token, friend]);

    /*Invites */
    const sendInvite = useCallback(async (friendId: string) => {
        const target = friendsRef.current.find((f) => f.id === friendId);
        if (!target || !token || !user || !socket) {
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

            socket.emit('send_friend_invite', {
                receiver_id: friendId,
                invite_code: invite.invite_code,
                sender_name: user.username,
                expires_at: invite.expires_at
            });
        } catch (err) {
            console.error('Error sending invite:', err);
        }
    }, [token, user, socket])

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
        activeInviteIdRef.current = null;
        setActiveInvite(null);
    }, [activeInvite])

    const declineInvite = useCallback(() => {
        activeInviteIdRef.current = null;
        setActiveInvite(null);
    }, [])

    const dismissInviteError = useCallback(() => setInviteError(null), []);

    const value: FriendsContext = {
        isLoading,
        profile,
        error,
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
    };

    return (
        <FriendsContextFunc.Provider value={value}>
            {children}
        </FriendsContextFunc.Provider>
    );
};