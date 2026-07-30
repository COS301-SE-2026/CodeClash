import { createServer } from 'node:http';

import dotnev from 'dotenv'
import { Server } from 'socket.io'
import { IEloRepository } from 'src/application/interfaces/IEloRepository';
import { IQuestionRepository } from 'src/application/interfaces/IQuestionRepository';
import { IUserRepository } from 'src/application/interfaces/IUserRepository';
import { initDB } from 'src/application/usecases/init-db';
import { EloRatings } from 'src/entities/db-entities/elo.entities';
import { Questions } from 'src/entities/db-entities/questions.entities';
import { EloRepository } from 'src/interface-adapters/repositories/elo.repository';
import { QuestionRepository } from 'src/interface-adapters/repositories/question.repository';
import { UserRepository } from 'src/interface-adapters/repositories/user.repository';
import { sendGameQuestions, joinMatchQueue, leaveMatchQueue, matchAccepted, matchDeclined } from 'src/interface-adapters/socket-handlers/matchmaking.handler';

import { Users } from "../entities/db-entities/user.entities"
import { validateToken } from '../interface-adapters/auth/auth.service';

import app from './app';
import { AppDataSource } from "./config/data-source"



dotnev.config()




// create server instance
const httpServer = createServer(app)     // can update to https
const io = new Server(httpServer, {
    cors: {
        origin: [process.env.FRONTEND_URL!],
        credentials: true
    },
}
);


// auth middleware
io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) return next(new Error("Authenticaion error: No token provided"));

    const valid = await validateToken(token)
    if (valid) {
        socket.data.user_id = valid.user_Id;
        next();
    }
    else next(new Error("Authentication error: Invalid token"));
})



// Initialise DB
AppDataSource.initialize()
    .then(async () => {

        // seeding logic

        const user_repo: IUserRepository = new UserRepository(AppDataSource.getRepository(Users));
        const elo_repo: IEloRepository = new EloRepository(AppDataSource.getRepository(EloRatings));
        await initDB(user_repo, elo_repo);

        const question_repo: IQuestionRepository = new QuestionRepository(AppDataSource.getRepository(Questions));

        // attach socket handlers
        io.on("connection", (socket) => {
          console.log("socket connected", socket.id);
          console.log("user_id:", socket.data.user_id)
            // SOCKET HANDLERS MUST MOOVE TO interface-adapter/
          socket.on('join_match_queue', async (data) => {
            console.log("join match queue", socket.id, data);
            await joinMatchQueue(io, socket, data)
          });

            socket.on('leave_match_queue', async () => await leaveMatchQueue(io, socket));

            socket.on('match_accepted', async (data) => {await matchAccepted(io,socket, data, question_repo,elo_repo) });

            socket.on('match_declined', (pair_id: string) => matchDeclined(io, socket, pair_id));

            socket.on('send_questions', ( game_id: number) => { sendGameQuestions(io, game_id) })
        })


        // start server
        httpServer.listen(3000, () => {
            console.log("Server listening")
        });
    }).catch(error => console.error(error))




export default httpServer
