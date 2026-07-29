import React, { useEffect, useState, type ReactNode } from 'react'
import type { Socket } from 'socket.io-client'
import { createSocket } from 'src/services/websocket.service'
import { SocketContext } from './SocketContextValue'
import type { MatchedUserDTO } from 'src/dtos/matched-user.dto'


export const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [matched, setMatched] = useState<MatchedUserDTO | null>(null);

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
            })

            socket.on('disconnect', () => {
                setIsConnected(false);
            })

            socket.on("users_matched", (data) => { setMatched(data) })
        }
    }, [socket])


    return (
        <SocketContext.Provider
            value={{
                socket,
                isConnected,
                matched
            }}
        >
            {children}
        </SocketContext.Provider>
    )
}



