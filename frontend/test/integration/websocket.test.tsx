import { beforeEach, describe, afterEach, beforeAll } from "vitest";
import { Server } from 'socket.io'
import { createServer } from "node:http";
import { it } from "node:test";

const http = createServer();

describe("Tests Socket Provider", () => {
    let io: Server;

    beforeEach(() => {
        io = new Server(http);
        http.listen(5050);
    })

    afterEach(() => {
        io.close()
        http.close();
    })


    it("")

})