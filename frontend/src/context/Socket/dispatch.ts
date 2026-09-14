import { Socket } from "socket.io-client";
import type { SocketResponse } from "src/dtos/socket/socket.dto";

export function registerHandler<T>(
    socket: Socket,
    event: string,
    handler: (data: T) => void
) {
    socket.on(event, handler);
    return () => socket.off(event, handler);
}

export function registerEmitter<Req, Res>(
    socket: Socket,
    event: string,
    data: Req
): Promise<SocketResponse<Res>> {

    return new Promise((resolve) => {
        socket.emit(
            event,
            data,
            (response: SocketResponse<Res>) => { resolve(response) }
        );
    });

}