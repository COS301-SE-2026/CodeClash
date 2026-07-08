import React, { useEffect, useState,  type ReactNode } from 'react'
import type { Socket } from 'socket.io-client'
import { createSocket } from 'src/services/websocket.service'

import { SocketContext } from './SocketContextValue'


export const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        createSocket().then((conn) => {
            if (conn) {
                setSocket(conn);
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
        }
    },[socket])


    return (
        <SocketContext.Provider
            value={{
                socket,
                isConnected
            }}
        >
            {children}
        </SocketContext.Provider>
    )
}



