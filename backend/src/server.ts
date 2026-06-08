import app from './app';
import express from 'express';
import {createServer} from 'http';
import {WebSocketServer} from 'ws';
import {fetchAuthSession} from 'aws-amplify/auth'

const PORT = process.env.PORT || 3000;


export const WSServer = () => {

const server = createServer(app);

const wss = new WebSocketServer({noServer : true}) //makes websocket not create its own http server but just use server created above


wss.on("connection", async (ws : WebSocket, req) =>{

    try{
        const url = new URL(req.url!, `http://${req.headers.host}`);
        const token = url.searchParams.get("token");

        if(!token){
            ws.close(4000, "No token found");
            return;
        }
    }

    



}





)
}