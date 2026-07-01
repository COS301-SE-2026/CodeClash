import app from '../../app';
import { createServer, IncomingMessage } from 'http';
import { WebSocket, WebSocketServer } from 'ws';
import { verifyToken, authPayload } from './verifyToken';
import MatchmakingUserDTO from '../../dtos/matchmaking.dto';
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
            expiry: 500000
        }))

        ws.on('message', (data) => {

            const message = JSON.parse(data);

            if (message.type === "token_refresh") {
                var user: authPayload;

                verifyToken(message.token).then((data) => {
                    user = data;


                    if (!user) {
                        ws.close(401, "Refresh token invalid");
                        return;
                    }

                    ws.send(JSON.stringify({
                        type: "TOKEN_REFRESHED",
                        expiry: user.expiry
                    }))
                })
            }


            handleMessage(ws, data.toString(), user)
        });
        ws.on('close', () => handleDisconnect(ws, user));
        ws.on('error', (err) => handleError(ws, user, err));
    });

    const PORT = process.env.WS_PORT || 3000;
    server.listen(PORT);

    return wss;
}