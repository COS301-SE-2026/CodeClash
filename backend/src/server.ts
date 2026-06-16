import app from './app';
import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import 'dotenv/config'

// parse env var to int 
const WEBSOCKET_PORT = process.env.WEBSOCKET_PORT ? parseInt(process.env.WEBSOCKET_PORT, 10) : 3000;


console.log(WEBSOCKET_PORT);
export const WSServer = () => {

    // const server = createServer(app);f

    // const wss = new WebSocketServer({ noServer: true })

    // create websocket server on listening on WEBSOCKET_PORT
    const wss = new WebSocketServer({
        host: '0.0.0.0',
        port: WEBSOCKET_PORT
    });

    wss.on('listening', () => {
        console.log(`Server listening on Port ${WEBSOCKET_PORT}`)
    })

    // checking auth on connection
    wss.on("connection", async (ws: WebSocket) => {
        // const url = new URL(req.url!, `http://${req.headers.host}`);
        // const token = url.searchParams.get("token");

        // if (!token) {
        //     ws.close(4000, "No token found");
        //     return;
        // }

        console.log("Client connected")

        // TODO: implement token verification


        // Message handling
        ws.onmessage = (event) => {
            // TODO: parse event data

            console.log(event.data);
        }
    }

    )

    wss.on('error', (err) => {
        console.error('WSS Error:',err);
    })
}

WSServer(); // calling server to start it 
