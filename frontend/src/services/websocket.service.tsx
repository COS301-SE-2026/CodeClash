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

    // handshoken toke reused on reconnect, therefore swapping in fresh one before needed in case token expires, 
    // otherwise user cant get back in
    let closed = false;
    const refreshToken = async () => {
        const fresh = await fetchAuthSession();
        const token = fresh.tokens?.idToken?.toString();
        conn.auth = { token };
        return token;
    }

    conn.on("disconnect", (reason) => {
        if (reason === "io client disconnect") {
            closed = true;  // closed on purpose (sign out), so don't come back
            return;
        }
        void refreshToken().catch(() => { });
    })
    conn.on("connect_error", (err) => {
        console.error(`Error connecting to socket: ${err}`);

        // socket.io won't retry by itself after the server rejects the handshake; only retry while still signed in
        if (conn.active === false && !closed) {
            setTimeout(() => {
                void refreshToken().then((token) => { if (token && !closed) conn.connect(); }).catch(() => { });
            }, 5000);
        }
    })


    return conn;
}



