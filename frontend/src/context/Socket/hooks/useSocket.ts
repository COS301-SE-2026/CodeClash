
import { useContext } from "react";

import { type SocketContextValue, SocketContext } from "../SocketContextValue";

export const useSocket = (): SocketContextValue => {
    const context = useContext(SocketContext);

    if (!context) throw new Error("useSocket must be used within a SocketProvider")
    return context
}
