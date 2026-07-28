import { createServer } from 'node:http';

import dotnev from 'dotenv'
import { Server } from 'socket.io'
import { EloRatings } from 'src/entities/db-entities/elo.entities';
import { IQuestionRepository } from 'src/application/interfaces/repositories/IQuestionRepository';
import { QuestionRepository } from 'src/interface-adapters/repositories/question.repository';
import { Questions } from 'src/entities/db-entities/questions.entities';
import { gameDone, sendResults, startQuestion, submitQuestion } from 'src/interface-adapters/socket-handlers/game.handler';
import { SubmissionDTO } from 'src/entities/dtos/components.dto';
import { IAnswerRepository } from 'src/application/interfaces/repositories/IAnswerRepository';
import { AnswerRepository } from 'src/interface-adapters/repositories/answer.repository';
import { Answers } from 'src/entities/db-entities/answers.entities';
import { GameService } from 'src/application/usecases/services/game.service';
import { CreateGame, CreateMatchEntity, CreatePlayerEntity, CreateRoundEntity } from 'src/application/usecases/systems/create-game';
import { GetDifficulty, GetQuestions, GetTotalTime } from 'src/application/usecases/services/questions.service';
import { GetAnswers } from 'src/application/usecases/services/answers.service';
import { GameCache } from 'src/interface-adapters/game-cache';
import { IGameCache } from 'src/application/interfaces/IGameCache';
import redis from './config/redis-client';
import { MatchmakingService } from 'src/application/usecases/services/matchmaking.service';
import { IMatchmakingCache } from 'src/application/interfaces/IMatchmakingCache';
import { IEloRepository } from 'src/application/interfaces/repositories/IEloRepository';
import { IUserRepository } from 'src/application/interfaces/repositories/IUserRepository';
import { CheckAnswer } from 'src/application/usecases/check-answer';
import { initDB } from 'src/application/usecases/init-db';
import { LifeSystem } from 'src/application/usecases/systems/life.system';
import { StartQuestionDTO } from 'src/entities/dtos/question.dto';
import { FinishGame } from 'src/application/usecases/systems/finish-game';
import { SubmissionSystem } from 'src/application/usecases/systems/submission.system';
import { PlayerDTO } from 'src/entities/dtos/components.dto';
import { ResultComponent } from 'src/entities/components';
import { GameQuestionsDTO } from 'src/entities/dtos/game-data.dto';
import { World } from 'src/entities/World';
import { MatchmakingCache } from 'src/interface-adapters/matchmaking-cache';
import { EloRepository } from 'src/interface-adapters/repositories/elo.repository';
import { UserRepository } from 'src/interface-adapters/repositories/user.repository';
import { sendGameQuestions, joinMatchQueue, leaveMatchQueue, matchAccepted, matchDeclined, sendGamePlayers } from 'src/interface-adapters/socket-handlers/matchmaking.handler';

import { Users } from "../entities/db-entities/user.entities"
import { validateToken } from '../interface-adapters/auth/auth.service';

import app from './app';
import { AppDataSource } from "./config/data-source"
import { OpponentProgress } from 'src/application/usecases/systems/opponent-progress';

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

        // initialise ecs world 
        const world = World();

        // initialise repos
        const user_repo: IUserRepository = new UserRepository(AppDataSource.getRepository(Users));
        const elo_repo: IEloRepository = new EloRepository(AppDataSource.getRepository(EloRatings));
        const question_repo: IQuestionRepository = new QuestionRepository(AppDataSource.getRepository(Questions));
        const answer_repo: IAnswerRepository = new AnswerRepository(AppDataSource.getRepository(Answers))


        // initialise use cases 
        const create_player_entity = new CreatePlayerEntity(world);
        const create_match_entity = new CreateMatchEntity(world);
        const create_round_entity = new CreateRoundEntity(world);

        const get_questions = new GetQuestions(question_repo);
        const get_answers = new GetAnswers(answer_repo);
        const get_difficulty = new GetDifficulty();
        const get_total_time = new GetTotalTime();

        const create_game = new CreateGame(create_player_entity, create_match_entity, create_round_entity);

        // create game cache
        const game_cache: IGameCache = new GameCache(redis);
        const matchmaking_cache: IMatchmakingCache = new MatchmakingCache(redis);


        // initialise services 
        const game_service = new GameService(create_game, get_questions, get_difficulty, get_total_time, get_answers, game_cache);
        const matchmkaing_service = new MatchmakingService(matchmaking_cache);

        // initialise systems 
        const submission_system = new SubmissionSystem(world);
        const life_system = new LifeSystem(world);
        const finish_game = new FinishGame(world);
        const opponent_progress = new OpponentProgress(world);

        const check_answer = new CheckAnswer(game_cache, submission_system, life_system, world)

        // initialise database with users and elos
        await initDB(user_repo, elo_repo);


        // Socket maps 
        const PAIRS = new Map<string, Map<string, { accepted: boolean, elo: number, username?: string, done?: boolean }>>();
        const GAME = new Map<number, { players: PlayerDTO[], questions: GameQuestionsDTO }>();
        const RESULTS = new Map<number, ResultComponent>();

        // attach socket handlers
        io.on("connection", (socket) => {

            // SOCKET HANDLERS MUST MOOVE TO interface-adapter/
            socket.on('join_match_queue', async (data) => await joinMatchQueue(io, socket, data, matchmkaing_service, PAIRS));

            socket.on('leave_match_queue', async () => await leaveMatchQueue(io, socket, matchmkaing_service));

            socket.on('match_accepted', async (data) => { await matchAccepted(io, socket, data, game_service, PAIRS, GAME) });

            socket.on('match_declined', (pair_id: string) => matchDeclined(io, socket, pair_id, PAIRS));

            socket.on('send_questions', (game_id: number) => { sendGameQuestions(io, game_id, GAME) });

            socket.on('send_players', (game_id: number) => { sendGamePlayers(io, game_id, GAME) })

            socket.on('submit_question', (data: SubmissionDTO) => submitQuestion(io, socket, data, check_answer, opponent_progress));

            socket.on('question_started', (data: StartQuestionDTO) => startQuestion(submission_system, data));

            socket.on('game_done', (pair_id: string, game_id: number) => gameDone(io, socket, pair_id, game_id, finish_game, PAIRS, RESULTS));

            socket.on('send_results', (game_id: number, pair_id:string) =>{ console.log("Server pairid: ", pair_id); sendResults(io, game_id,pair_id, RESULTS, PAIRS)})
        })


        // start server
        httpServer.listen(3000, () => {
            console.log("Server listening")
        });
    }).catch(error => console.error(error))




export default httpServer