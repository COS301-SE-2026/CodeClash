import { createServer } from 'node:http';
import { Server } from 'socket.io'
import { validateToken } from '../interface-adapters/auth/auth.service';
import app from './app';
import dotnev from 'dotenv'
import { sendGameQuestions, joinMatchQueue, leaveMatchQueue, matchAccepted, matchDeclined } from 'src/interface-adapters/socket-handlers/matchmaking.handler';
import { AppDataSource } from "./config/data-source"
import { Users } from "../entities/db-entities/user.entities"
import { initDB } from 'src/application/usecases/init-db';
import { IUserRepository } from 'src/application/interfaces/repositories/IUserRepository';
import { UserRepository } from 'src/interface-adapters/repositories/user.repository';
import { IEloRepository } from 'src/application/interfaces/repositories/IEloRepository';
import { EloRepository } from 'src/interface-adapters/repositories/elo.repository';
import { EloRatings } from 'src/entities/db-entities/elo.entities';
import { IQuestionRepository } from 'src/application/interfaces/repositories/IQuestionRepository';
import { QuestionRepository } from 'src/interface-adapters/repositories/question.repository';
import { Questions } from 'src/entities/db-entities/questions.entities';
import { submitQuestion } from 'src/interface-adapters/socket-handlers/game.handler';
import { SubmissionDTO } from 'src/entities/dtos/game-data.dto';
import { IAnswerRepository } from 'src/application/interfaces/repositories/IAnswerRepository';
import { AnswerRepository } from 'src/interface-adapters/repositories/answer.repository';
import { Answers } from 'src/entities/db-entities/answers.entities';
import { GameService } from 'src/application/usecases/services/game.service';
import { CreateGame, CreateMatchEntity, CreatePlayerEntity, CreateRoundEntity } from 'src/application/usecases/create-game';
import { GetDifficulty, GetQuestions, GetTotalTime } from 'src/application/usecases/questions';
import { GetAnswers } from 'src/application/usecases/answers';
import { GameCache } from 'src/interface-adapters/game-cache';
import { IGameCache } from 'src/application/interfaces/IGameCache';
import redis from './config/redis-client';

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

        // initialise repos
        const user_repo: IUserRepository = new UserRepository(AppDataSource.getRepository(Users));
        const elo_repo: IEloRepository = new EloRepository(AppDataSource.getRepository(EloRatings));
        const question_repo: IQuestionRepository = new QuestionRepository(AppDataSource.getRepository(Questions));
        const answer_repo: IAnswerRepository = new AnswerRepository(AppDataSource.getRepository(Answers))


        // initialise use cases 
        const create_player_entity = new CreatePlayerEntity();
        const create_match_entity = new CreateMatchEntity();
        const create_round_entity = new CreateRoundEntity();

        const get_questions = new GetQuestions(question_repo);
        const get_answers = new GetAnswers(answer_repo);
        const get_difficulty = new GetDifficulty();
        const get_total_time = new GetTotalTime();

        const create_game = new CreateGame(create_player_entity, create_match_entity, create_round_entity);

        // create game cache
        const game_cache:IGameCache = new GameCache(redis);


        // initialise services 
        const game_service = new GameService(create_game,get_questions, get_difficulty, get_total_time, get_answers, game_cache);



        // initialise database with users and elos
        await initDB(user_repo, elo_repo);

        // attach socket handlers
        io.on("connection", (socket) => {

            // SOCKET HANDLERS MUST MOOVE TO interface-adapter/
            socket.on('join_match_queue', async (data) => await joinMatchQueue(io, socket, data));

            socket.on('leave_match_queue', async () => await leaveMatchQueue(io, socket));

            socket.on('match_accepted', async (data) => { await matchAccepted(io, socket, data,game_service) });

            socket.on('match_declined', (pair_id: string) => matchDeclined(io, socket, pair_id));

            socket.on('send_questions', (game_id: number) => { sendGameQuestions(io, game_id) });

            socket.on('submit_question', (data: SubmissionDTO) => submitQuestion(data));
        })


        // start server
        httpServer.listen(3000, () => {
            console.log("Server listening")
        });
    }).catch(error => console.error(error))




export default httpServer