import { createServer } from 'node:http';
import { Server } from 'socket.io'
import { validateToken } from '../interface-adapters/auth/auth.service';
import app from './app';
import dotnev from 'dotenv'
import { sendGameQuestions, joinMatchQueue, leaveMatchQueue, matchAccepted, matchDeclined } from 'src/interface-adapters/socket-handlers/matchmaking.handler';
import { AppDataSource } from "./config/data-source"
import { Users } from "../entities/db-entities/user.entities"
import { initDB } from 'src/application/usecases/init-db';
import { IUserRepository } from 'src/application/interfaces/IUserRepository';
import { UserRepository } from 'src/interface-adapters/repositories/user.repository';
import { IEloRepository } from 'src/application/interfaces/IEloRepository';
import { EloRepository } from 'src/interface-adapters/repositories/elo.repository';
import { EloRatings } from 'src/entities/db-entities/elo.entities';
import { IQuestionRepository } from 'src/application/interfaces/IQuestionRepository';
import { QuestionRepository } from 'src/interface-adapters/repositories/question.repository';
import { Questions } from 'src/entities/db-entities/questions.entities';
import { submitAnswer } from 'src/interface-adapters/socket-handlers/game.handler';

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

            // SOCKET HANDLERS MUST MOOVE TO interface-adapter/
            socket.on('join_match_queue', async (data) => await joinMatchQueue(io, socket, data));

            socket.on('leave_match_queue', async () => await leaveMatchQueue(io, socket));

            socket.on('match_accepted', async (data) => {await matchAccepted(io,socket, data, question_repo,elo_repo) });

            socket.on('match_declined', (pair_id: string) => matchDeclined(io, socket, pair_id));

            socket.on('send_questions', ( game_id: number) => { sendGameQuestions(io, game_id) });

            //CheckAnswer is a dependency that needs to be injected (might be in the submission-service branch)
            socket.on('submit_answer', (data) => submitAnswer(io, socket, data, checkAnswerInstance));
        })


        // start server
        httpServer.listen(3000, () => {
            console.log("Server listening")
        });
    }).catch(error => console.error(error))




export default httpServer