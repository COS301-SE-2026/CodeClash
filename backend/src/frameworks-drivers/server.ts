import { createServer } from 'node:http';

import dotnev from 'dotenv'
import { Server } from 'socket.io'
import { EloRatings } from 'src/entities/db-entities/elo.entities';
import { IQuestionRepository } from 'src/application/interfaces/repositories/IQuestionRepository';
import { QuestionRepository } from 'src/interface-adapters/repositories/question.repository';
import { GameType, Questions } from 'src/entities/db-entities/questions.entities';
import { cleanUp, gameDone, sendResults, startQuestion, submitQuestion } from 'src/interface-adapters/socket-handlers/game.handler';
import { SubmissionDTO } from 'src/interface-adapters/dtos/components.dto';
import { IAnswerRepository } from 'src/application/interfaces/repositories/IAnswerRepository';
import { AnswerRepository } from 'src/interface-adapters/repositories/answer.repository';
import { Answers } from 'src/entities/db-entities/answers.entities';
import { GameService } from 'src/application/usecases/services/game.service';
import { CreateGame, CreateMatchEntity, CreatePlayerEntity, CreateRoundEntity } from 'src/application/usecases/systems/create-game';
import { GetDifficulty, GetQuestions, GetTotalTime } from 'src/application/usecases/services/questions.service';
import { GetAnswers } from 'src/application/usecases/services/answers.service';
import { GameCache } from 'src/interface-adapters/cache/game-cache';
import { IGameCache } from 'src/application/interfaces/cache/IGameCache';
import redis from './config/redis-client';
import { MatchmakingService } from 'src/application/usecases/services/matchmaking.service';
import { IMatchmakingCache } from 'src/application/interfaces/cache/IMatchmakingCache';
import { IEloRepository } from 'src/application/interfaces/repositories/IEloRepository';
import { IUserRepository } from 'src/application/interfaces/repositories/IUserRepository';
import { CheckAnswer } from 'src/application/usecases/check-answer';
import { initDB } from 'src/application/usecases/init-db';
import { LifeSystem } from 'src/application/usecases/systems/life.system';
import { StartQuestionDTO } from 'src/interface-adapters/dtos/question.dto';
import { FinishGame } from 'src/application/usecases/systems/finish-game';
import { SubmissionSystem } from 'src/application/usecases/systems/submission.system';
import { World } from 'src/entities/World';
import { MatchmakingCache } from 'src/interface-adapters/cache/matchmaking-cache';
import { EloRepository } from 'src/interface-adapters/repositories/elo.repository';
import { UserRepository } from 'src/interface-adapters/repositories/user.repository';
import { sendGameQuestions, joinMatchQueue, leaveMatchQueue, matchAccepted, matchDeclined, sendGamePlayers } from 'src/interface-adapters/socket-handlers/matchmaking.handler';

import { Users } from "../entities/db-entities/user.entities"
import { validateToken } from '../interface-adapters/auth/auth.service';

import  app from './app';
import { AppDataSource } from "./config/data-source"
import { OpponentProgress } from 'src/application/usecases/systems/opponent-progress';
import { IMatchRepository } from 'src/application/interfaces/repositories/IMatchRepository';
import { MatchRepository } from 'src/interface-adapters/repositories/match.repository';
import { Matches, MatchLog } from 'src/entities/db-entities/match.entities';
import { MatchResultService } from 'src/application/usecases/services/match-result.service';
import { IMatchResultRepository } from 'src/application/interfaces/repositories/IMatchResultRepository';
import { MatchResultRepository } from 'src/interface-adapters/repositories/match-result.repository';
import { MatchedUsersService } from 'src/application/usecases/services/matched-users.service';
import { GameStore } from 'src/application/usecases/services/game-store.service';
import { DeleteGame } from 'src/application/usecases/systems/delete-game';
import { MatchStatsRepository } from 'src/interface-adapters/repositories/match-stats.repository';
import { MatchStats } from 'src/entities/db-entities/match-stats.entities';
import { Achievement } from 'src/entities/db-entities/achievement.entities';
import { AchievementService } from 'src/application/usecases/services/achievement.service';
import { AchievementRepository } from 'src/interface-adapters/repositories/achievement.repository';

dotnev.config()

// create server instance
// Initialise DB
AppDataSource.initialize()
    .then(async () => {

        // initialise repos
        const user_repo: IUserRepository = new UserRepository(AppDataSource.getRepository(Users));
        const elo_repo: IEloRepository = new EloRepository(AppDataSource.getRepository(EloRatings));
        const question_repo: IQuestionRepository = new QuestionRepository(AppDataSource.getRepository(Questions));
        const answer_repo: IAnswerRepository = new AnswerRepository(AppDataSource.getRepository(Answers))
        const match_repo: IMatchRepository = new MatchRepository(AppDataSource.getRepository(Matches))
        const match_results_repo: IMatchResultRepository = new MatchResultRepository(
            AppDataSource.getRepository(MatchLog),
            AppDataSource.getRepository(Users)
        )
        const match_stats_repo = new MatchStatsRepository(AppDataSource.getRepository(MatchStats));
        const achievementRepo = new AchievementRepository(AppDataSource.getRepository(Achievement), AppDataSource.getRepository(Users));
        const achievement_service = new AchievementService(achievementRepo);

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

                // get db id from cognito id
                const db_id = (await user_repo.getUserId(valid.user_Id))!.user_id;
                const username = (await user_repo.getUserData(db_id!, 'username'))!.username


                socket.data = {
                    user_id: db_id,
                    username: username
                }
                next();
            }
            else next(new Error("Authentication error: Invalid token"));
        })

        // initialise ecs world 
        const world = World();



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
        const game_service = new GameService(create_game, get_questions, get_difficulty, get_total_time, get_answers, game_cache, match_repo, user_repo);
        const matchmkaing_service = new MatchmakingService(matchmaking_cache);
        const match_results = new MatchResultService(elo_repo, match_results_repo)
        const matched_users_service = new MatchedUsersService();
        const game_store = new GameStore(user_repo);

        // initialise systems 
        const submission_system = new SubmissionSystem(world);
        const life_system = new LifeSystem(world);
        const delete_game = new DeleteGame(world,game_store,matched_users_service);
        const finish_game = new FinishGame(world, match_results, game_store, delete_game, match_stats_repo, achievement_service);
        const opponent_progress = new OpponentProgress(world);

        const check_answer = new CheckAnswer(game_cache, submission_system, life_system, world);

        const playerAvatars = new Map();

        // initialise database with users and elos
        await initDB(user_repo, elo_repo);

        // attach socket handlers
        io.on("connection", (socket) => {

            // SOCKET HANDLERS MUST MOOVE TO interface-adapter/
            socket.on('join_match_queue', async (data) => await joinMatchQueue(io, socket, data, matchmkaing_service, matched_users_service, user_repo));

            socket.on('leave_match_queue', async () => await leaveMatchQueue(io, socket, matchmkaing_service));

            socket.on('match_accepted', async (data) => { await matchAccepted(io, socket, data, game_service, matched_users_service, game_store) });

            socket.on('match_declined', (pair_id: string) => matchDeclined(io, socket, pair_id, matched_users_service));

            socket.on('send_questions', (game_id: number) => { sendGameQuestions(io, game_id, game_store) });

            socket.on('send_players', (game_id: number) => { sendGamePlayers(io, game_id, game_store) })

            socket.on('submit_question', (data: SubmissionDTO) => submitQuestion(io, socket, data, check_answer, opponent_progress));

            socket.on('question_started', (data: StartQuestionDTO) => startQuestion(socket.data.user_id,submission_system, data));

            socket.on('game_done', ( game_id: number, game_type: GameType, pair_id:string) => gameDone(io, socket, game_id,game_type, pair_id,finish_game, game_store));

            socket.on('send_results', (game_id: number, pair_id: string) => sendResults(io, game_id, pair_id, game_store))

            socket.on('clean_up', (game_id: number, pair_id: string)=> cleanUp(game_id, pair_id, delete_game, game_store))

            socket.on('send_friend_invite', (data) => {
                io.to(data.receiver_id).emit('friend_invite_received', {
                    invite_id: data.invite_code,
                    sender_name: data.sender_name,
                    expires_at: data.expires_at
                });
            });

            socket.on('request_all_avatars', (pair_id) => {
                const pair = io.sockets.adapter.rooms.get(pair_id);
                const avatarsInPair = {};
                if(pair){
                    for (const socketId of pair){
                        const sid = io.sockets.sockets.get(socketId);
                        const uid = sid?.data?.user_id;
                        if(uid && playerAvatars.has(uid)){
                            avatarsInPair[uid] = playerAvatars.get(uid);
                        }
                    }
                }

                socket.emit('avatar_all_data', avatarsInPair);
            });

            socket.on("avatar_updated", ({ pose, colour }) => {
                playerAvatars.set(socket.data.user_id, {pose, colour});

                socket.rooms.forEach((pair) => {
                    socket.to(pair).emit('user_updated_avatar', {socket.data.user_id, pose, colour});
                })
            });


            
        });


        // start server
        httpServer.listen(3000, () => {
            console.log("Server listening")
        });
    }).catch(error => console.error(error))

// export default httpServer
