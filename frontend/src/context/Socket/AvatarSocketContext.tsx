import {createContext, useContext, useEffect, useState} from 'react';
import { Socket } from 'socket.io-client';
import { useSocket } from './hooks/useSocket';

const AvatarSocketContext = createContext(null);

export function AvatarSocketProvider({pairId, children}){

    const [avatars, setAvatars] = useState({});
    const {socket} = useSocket();

    useEffect(() => {
        if (!pairId) return;

        //below asks for every player's avatar upon joining
        socket.emit('request_all_avatars', pairId);

        socket.on('avatar_all_data', (avatarsInPair) => {
            setAvatars((prev) => ({...prev, ...avatarsInPair}));
        });

        socket.on('user_updated_avatar', ({userId, pose, colour}) => {
            setAvatars((prev) => ({...prev, [userId]: {pose, colour}}));
        });

        
    })
}