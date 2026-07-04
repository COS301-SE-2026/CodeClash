import React, { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import type { Socket } from 'socket.io-client'
import { createSocket } from 'src/services/websocket.service'


interface SocketContextValue {
    socket: Socket | null
    isConnected: boolean
}

const SocketContext = createContext<SocketContextValue | null>(null);

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

export const useSocket = (): SocketContextValue => {
    const context = useContext(SocketContext);

    if (!context) throw new Error("useSocket must be used within a SocketProvider")
    return context
}


