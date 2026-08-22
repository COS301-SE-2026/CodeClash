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

const API_BASE = '/api'; 
const INVITE_POPUP = 5000; // **Needs to be swapped with a real socket listener for incoming invites pop up
const INVITE_EXPIRY = 10 * 60 * 1000; // **We need an expires field on the invite response, this is currently just a client side approx based on the recieved time of invite

/*This data is mocked, all real endpoints need to replace this - !!For the profile, we can use the existing user context from FinalResults? */
const MOCKED_PROFILE: Summary = {
    id: 'user',
    username: 'mockUser22',
    avatar: 'avatar',
    league: 'Venus'
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
        avatar: 's1Avatar'
    },
    {
        id: 's2',
        username: 's2Username',
        avatar: 's2Avatar'
    },
    {
        id: 's3',
        username: 's3Username',
        avatar: 's3Avatar'
    },
]