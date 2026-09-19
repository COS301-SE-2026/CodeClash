import React, { useEffect, useState, type ReactNode } from 'react'
import type { Socket } from 'socket.io-client'
import { createSocket } from 'src/services/websocket.service'

import { SocketContext } from './SocketContextValue'
import { MatchSocket } from './modules/match.socket'
import { MatchmakingSocket } from './modules/matchmaking.socket'


export const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [match_socket, set_match_socket] = useState<MatchSocket | null>(null);
    const [matchmaking_socket, set_matchmaking_socket] = useState<MatchmakingSocket | null>(null);

    useEffect(() => {
        createSocket().then((conn) => {
            if (conn) {
                setSocket(conn);
            }
            else {
                console.error("Error Creating Socket Connection");
            }
        })

    }, []);

    useEffect(() => {
        if (socket) {
            socket.on('connect', () => {
                setIsConnected(true);
                set_match_socket(new MatchSocket(socket));
                set_matchmaking_socket(new MatchmakingSocket(socket));

            })

            socket.on('disconnect', () => {
                setIsConnected(false);
            })

        }
    }, [socket])


    return (
        <SocketContext.Provider
            value={{
                match_socket,
                matchmaking_socket,
                isConnected,

            }}
        >
            {children}
        </SocketContext.Provider>
    )
}



