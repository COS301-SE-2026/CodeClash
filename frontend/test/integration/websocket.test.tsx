import { beforeEach, describe, afterEach, beforeAll } from "vitest";
import { Server } from 'socket.io'
import { createServer } from "node:http";
import { it } from "node:test";
import { type JWT } from "aws-amplify/auth";
import { getToken, login, logout } from "root/testing/test-utils"

import { SocketProvider } from "src/context/Socket/SocketContext";

const http = createServer();

describe("Tests Socket Provider", () => {
    let io: Server;
    let token: JWT | undefined;

    beforeEach(async () => {

        // setup server for each test
        io = new Server(http);
        http.listen(5050);

        // login and get token for user 
        await login()
        token = await getToken();
    })

    afterEach(async () => {
        io.close()
        http.close();
        await logout();
    })


    it("Creates socket", () => {
        <SocketProvider>
            <div></div>
        </SocketProvider>
    })

})