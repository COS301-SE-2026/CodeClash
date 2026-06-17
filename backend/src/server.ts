import app from './app';
import express from 'express';
import {createServer} from 'http';
import {WebSocketServer} from 'ws';
import {fetchAuthSession} from 'aws-amplify/auth'
import {verifyToken} from './verifyToken'

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

        const userId = (await verifyToken(token)).userId;
        const username = (await verifyToken(token)).username;
    }
    catch(err){
        console.error('Error verifying JWT: ', err);
    }



}





)
}