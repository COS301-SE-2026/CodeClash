import { Socket } from "socket.io";
import { SocketAckCallback } from "src/entities/dtos/socket/socket.dto";

export function registerHandler<Req, Res>(
    socket: Socket,
    event: string,
    handler: (socket: Socket, payload: Req) => Promise<Res>
) {
    socket.on(event, async (payload: Req, ack: SocketAckCallback<Res>) => {
        try {
            const data = await handler(socket, payload);

            if (data === undefined) {
                ack?.({ ok: true });
            }
            else {
                ack?.({ ok: true, data });
            }

        }
        catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);

            console.error(`socket: ${event}`, error);
            ack?.({ ok: false, error: message });
        }
    })
}

