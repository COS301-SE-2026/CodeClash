import { fetchAuthSession } from 'aws-amplify/auth';
import { io, Socket } from 'socket.io-client'



const env = import.meta.env;

export async function createSocket(): Promise<Socket> {
    const session = await fetchAuthSession({ forceRefresh: true })
    const token = session.tokens?.idToken

    const options = {
        auth: {
            token: token?.toString()
        }
    }

  const conn = io(env.VITE_WEBSOCKET_URL, options);
  console.log(env.VITE_WEBSOCKET_URL, "THIS IS THE PRINT")


    conn.on("connect_error", (err) => {
        console.error(`Error connecting to socket: ${err}`);
    })

  conn.on("connect", () => {
    console.log("CONNECTED", conn.id)
  })

  conn.on("disconnect", (reason) => {
    console.log("DISCONNECTED", conn.id, reason)
  })


    conn.on("back_to_dash", ()=>{
        
    })

    return conn;
}



