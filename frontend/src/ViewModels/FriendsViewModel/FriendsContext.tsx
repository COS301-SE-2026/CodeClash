import React from "react";
import {
    createContext, useCallback, useEffect, 
    useMemo, useRef, useState,
} from "react";

import {friendContent} from "../../Models/FriendsModel";
import type {
    Friend, FriendRequest, Invite, GameInvite, 
    Relation, Search, Summary
} from "../../Models/FriendsModel";

import { useAuth } from "../../context/Auth/hooks/useAuth";
import { Search } from "lucide-react";

const API_BASE = '/api'; 
const INVITE_POLL = 5000; // **Needs to be swapped with a real socket listener for incoming invites pop up
const INVITE_EXPIRY = 10 * 60 * 1000; // **We need an expires field on the invite response, this is currently just a client side approx based on the recieved time of invite

/*This data is mocked, all real endpoints need to replace this - !!For the profile, we can use the existing user context from FinalResults? */
const MOCKED_PROFILE: Summary = {
    id: 'user',
    username: 'mockUser22',
    avatar: 'avatar',
    league: 'Venus',
    handle: 'userHandle'
}

/*Need an endpont for - GET /api/friends (list)*/
const MOCKED_FRIENDS: Friend[] = [
    {
        id: 'u1',
        username: 'u1Username',
        avatar: 'u1Avatar',
        status: 'online',
        elo: 900,
    },
    {
        id: 'u2',
        username: 'u2Username',
        avatar: 'u2Avatar',
        status: 'offline',
        elo: 909,
    },
    {
        id: 'u3',
        username: 'u3Username',
        avatar: 'u3Avatar',
        status: 'playing',
        elo: 999,
    },
]

/*Need an endpoint for - GET /api/friend/requests */
const MOCKED_REQ: FriendRequest[] = [
    {
        id: 'req1',
        username: 'reqUser1',
        avatar: 'avatar',
        sentAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), 
        fromUser: 'sendingUser'
    }
]

/*Need an endpoint for - user search */
const MOCKED_SEARCHPOOL: Omit <Search, 'relationship'>[] = [
    {
        id: 's1',
        username: 's1Username',
        avatar: 's1Avatar',
    },
    {
        id: 's2',
        username: 's2Username',
        avatar: 's2Avatar',
    },
    {
        id: 's3',
        username: 's3Username',
        avatar: 's3Avatar',
    },
]

interface FriendsContext {
    isLoading: boolean;
    profile: Summary | null;
    friends: Friend[];
    removeFriend: (id: string) => void;

    requests: FriendRequest[];
    requestCount: number;
    acceptRequest: (id: string) => void;
    declineRequest: (id: string) => void;

    searchQuery: string;
    setSearchQuery: (query: string) => void;
    searchResults: Search[];
    sendFriendRequest: (id: string) => void;

    sendInvite: (id: string) => void;
    activeInvite: Invite | null;
    inviteCountdown: number;
    inviteError: string | null;
    acceptInvite: () => void;
    declineInvite: () => void;
    dismissInviteError: () => void;
}

export const FriendsContextFunc = createContext<FriendsContext | null>(null);

export const FriendsProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const {token, user} = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [profile, setProfile] = useState<Summary | null>(null);
    const [friend, setFriend] = useState<Friend[]>([]);
    const [requests, setRequests] = useState<FriendRequest[]>([]);
    const [sentRequest, setSentRequest] = useState<Set<string>>(new Set());
    const [searchQuery, setSearchQuery] = useState('');
    const [activeInvite, setActiveInvite] = useState<Invite | null>(null);
    const [inviteError, setInviteError] = useState<string | null>(null);
    const [now, setNow] = useState(() => Date.now());

    const friendsRef = useRef(friend); //this is so closures dont capture a stale list
    friendsRef.current = friend;

    const activeInviteIdRef = useRef<string | null>(null); //tracks the current id for Invites, so we can differentiate same invite to new invite without resetting local countdown

    const enrichInvite = useCallback((raw: GameInvite, expires: number): Invite => ({
        id: raw.invite_id,
        mode: 'casual',
        participants: raw.friends.map((p) => {
            const match = friendsRef.current.find((f) => f.username === p.name);
            return {
                name: p.name,
                elo: p.elo,
                friendId: match?.id,
                avatar: match?.avatar,
                status: match?.status,
            }
        }),
        expires,
    }), []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setProfile(MOCKED_PROFILE);
            setFriend(MOCKED_FRIENDS);
            setRequests(MOCKED_REQ);
            setIsLoading(false);
        }, 400);
        return () => clearTimeout(timeout);
    }, []);

    /*GET /api/friend/invite for an incoming friend invite */
    useEffect(() => {
        if (isLoading || !token) {
            return;
        }
        let cancelled = false;

        const poll =  async () => {
            try {
                const res = await fetch(`${API_BASE}/friend/invite`, {
                    headers: {Authorization: `Bearer ${token}`},
                })
                //No active invites
                if (res.status === 404) {
                    if(!cancelled) {
                        activeInviteIdRef.current = null;
                        setActiveInvite(null);
                    }
                    return;
                }
                if (!res.ok) {
                    return;
                }
                const raw: GameInvite = await res.json();
                if (cancelled) {
                    return;
                }
                if(raw.invite_id !== activeInviteIdRef.current) {
                    activeInviteIdRef.current = raw.invite_id;
                    setActiveInvite(enrichInvite(raw, Date.now()))
                }
            }
            catch {}
        }

        poll();
        const interval = setInterval(poll, INVITE_POLL);
        return () => {
            cancelled = true;
            clearInterval(interval);
        }
    }, [isLoading, token, enrichInvite])

    useEffect(() => {
        if (!activeInvite) {
            return;
        }
        const interval = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(interval);
    }, [activeInvite])

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

    /*SEARCH - needs endpoint */
    const search: Search[] = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) {
            return [];
        }
        const friendId = new Set(friend.map((f) => f.id));
        const incomingReqs = new Set(requests.map((r) => r.fromUser));
        return MOCKED_SEARCHPOOL.filter((u) => u.username.toLowerCase().includes(query)).map((u): Search => {
            let relationship: Relation = 'none';
            if (u.username === profile?.handle) {
                relationship = 'self';
            }
            else if (friendId.has(u.id)) {
                relationship = 'friend';
            }
            else if (sentRequest.has(u.id)) {
                relationship = 'pending-sent';
            }
            else if (incomingReqs.has(u.id)) {
                relationship = 'pending-received';
            }
            return {
                id: u.id,
                username: u.username, 
                avatar: u.avatar,
                relationship
            }
        })
    }, [searchQuery, friend, requests, sentRequest, profile])

    const sendFriendRequest = useCallback((id: string) => {
        setSentRequest((prev) => new Set(prev).add(id))
    }, [])

    /*Requests - needs accept and decline endpoint */
    const acceptRequest = useCallback((id: string) => {
        const req = requests.find((r) => r.id === id);
        if (!req) {
            return;
        }
        setRequests((prev) => prev.filter((r) => r.id !== id));
        setFriend((prev) => [
            ...prev, {
                id: req.fromUser, 
                username: req.username,
                avatar: req.avatar,
                status: 'offline',
                elo: 1000
            }
        ])
    }, [requests])

    const declineRequest = useCallback((id: string) => {
        setRequests((prev) => prev.filter((r) => r.id !== id));
    }, [])

    /*Friends - needs remove friend endpoint */
    const removeFriend = useCallback((id: string) => {
        setFriend((prev) => prev.filter((f) => f.id !== id));
    }, [])
}