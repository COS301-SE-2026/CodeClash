import { Socket } from "socket.io-client";
import type { SocketResponse } from "src/dtos/socket/socket.dto";

export function on<T>(
    socket: Socket,
    event: string,
    handler: (data: T) => void
) {
    socket.on(event, handler);
    return () => socket.off(event, handler);
}

export function emit<Req, Res>(
    socket: Socket,
    event: string,
    data?: Req
): Promise<SocketResponse<Res>> {

    const timeout = 10000;
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error(`${event} timed out`)), timeout);
        socket.emit(event, data, (response: SocketResponse<Res>) => {
            clearTimeout(timer);
            response.ok ? resolve(response) : reject(new Error(response.error));
        }
        );
    });

}