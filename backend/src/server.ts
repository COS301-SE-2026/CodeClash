import app from './app'
import WebSocketServer from 'ws'

const PORT = process.env.PORT || 3000;
const WEBSOCKET_PORT = Number(process.env.WEBSOCKET_PORT) || 7000;

// WebSocket
const socketserver = new WebSocketServer.Server({ port: WEBSOCKET_PORT });
socketserver.on('connection', (socket) => {
  socket.on('message', (data) => {
    // we will have to decide on a data format so that we can parse this and dispatch 

    // we will also decide on response codes/types
    socket.send("response");
  });

  socket.on('error', (error) => {
    // will need error handling
  });

  socket.on('open', () => {
    socket.send("ready");
  })
})


// REST API
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});