import app from './app';
import express from 'express';
import {createServer} from 'http';
import {WebSocketServer} from 'ws';



const PORT = process.env.PORT || 3000;

const server = createServer(app);

const wss = new WebSocketServer({server});

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });