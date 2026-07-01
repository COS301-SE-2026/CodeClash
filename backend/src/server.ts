import app from './app';
import { createServer, IncomingMessage } from 'http';
import { WebSocket, WebSocketServer } from 'ws';
import { authenticate } from './app'
import MatchmakingUserDTO from './dtos/matchmaking.dto';
import { handleMessage, handleDisconnect, handleError } from './wsMessageHandler';
import { getConnection, removeConnection } from './wsClients';

declare module 'http' {
    interface IncomingMessage {
        userDto?: MatchmakingUserDTO //this lets us attach the user to the sent request
    }
}

export const WSServer = () => {

    const server = createServer(app);
    const wss = new WebSocketServer({ noServer: true })

    // authorise before handshake confirmed
    server.on('upgrade', async (req: IncomingMessage, socket, head) => {
        try {
            const user = await authenticate(req, null, null) as MatchmakingUserDTO

            if (!user) {
                socket.write('HTTP/1.1 404 User Not Found\r\n\r\n');
                socket.destroy();
                return;
            }

            // allow connection upgrade
            req.userDto = user;
            wss.handleUpgrade(req, socket, head, (ws) => {
                wss.emit('connection', ws, req)
            })

        }
        catch {
            socket.write('HTTP/1.1 401 Unauthorised\r\n\r\n');
            socket.destroy();
        }
    })

    //now the actual websocket connection must be created
    wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {

        const user = req.userDto!;

        const isExisting = getConnection(user)

        // if the user already has a connection replace it with a new one
        if (isExisting) {
            isExisting.close(1000, 'Replaced by new connection');
            removeConnection(user);
        }

        console.log(`WS Connection for User: ${user.id}`);

        // send confirmation to client
        ws.send(JSON.stringify({
            type: 'SESSION_OPEN',
            id: user.id,
            elo: user.elo,
            joinedAt: user.joined_at
        }))

        ws.on('message', (data) => handleMessage(ws, data.toString(), user));
        ws.on('close', () => handleDisconnect(ws, user));
        ws.on('error', (err) => handleError(ws, user, err));
    });

    const PORT = process.env.WS_PORT || 3030;
    server.listen(PORT);

    return wss;
}