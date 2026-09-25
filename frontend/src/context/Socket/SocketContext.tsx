import React, { useEffect, useState, type ReactNode } from 'react'
import type { Socket } from 'socket.io-client'
import { createSocket } from 'src/services/websocket.service'

import { SocketContext } from './SocketContextValue'
import { MatchSocket } from './modules/match.socket'
import { MatchmakingSocket } from './modules/matchmaking.socket'
import { TournamentSocket } from './modules/tournament.socket'


export const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [matchSocket, setMatchSocket] = useState<MatchSocket | null>(null);
    const [matchmakingSocket, setMatchmakingSocket] = useState<MatchmakingSocket | null>(null);
    const [tournamentSocket, setTournamentSocket] = useState<TournamentSocket|null>(null);

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
                setMatchSocket(new MatchSocket(socket));
                setMatchmakingSocket(new MatchmakingSocket(socket));
                setTournamentSocket(new TournamentSocket(socket));

            })

            socket.on('disconnect', () => {
                setIsConnected(false);
            })

        }
    }, [socket])


    return (
        <SocketContext.Provider
            value={{
                matchSocket,
                matchmakingSocket,
                tournamentSocket,
                isConnected,

            }}
        >
            {children}
        </SocketContext.Provider>
    )
}



