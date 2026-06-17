import WebSocket from "ws";

const clientList = new Map<WebSocket, string>();


export const registerConnection = (ws : WebSocket, userId : string) =>
    clientList.set(ws,userId);