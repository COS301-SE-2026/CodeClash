import { createServer } from 'node:http';

import dotnev from 'dotenv'
import { Server } from 'socket.io'
import { EloRatings } from 'src/entities/database/elo.entities';
import { IQuestionRepository } from 'src/application/interfaces/repositories/IQuestionRepository';
import { QuestionRepository } from 'src/interface-adapters/repositories/question.repository';
import { Questions } from 'src/entities/database/questions.entities';
//import { cleanUp, gameDone, sendResults, startQuestion, submitQuestion } from 'src/interface-adapters/socket-handlers/game.handler';
import { PlayerSubmissionDTO } from 'src/entities/dtos/submissions/submission.dto';
import { IAnswerRepository } from 'src/application/interfaces/repositories/IAnswerRepository';
import { AnswerRepository } from 'src/interface-adapters/repositories/answer.repository';
import { Answers } from 'src/entities/database/answers.entities';
import { MatchCreationService } from 'src/application/usecases/services/match/match-creation.service';
import { MatchCreationSystem, CreateMatchEntity, CreatePlayerEntity, CreateRound} from 'src/application/usecases/systems/match-creation.system';
import { GetDifficulty, GetQuestions, GetTotalTime } from 'src/application/usecases/services/questions.service';
import { GetAnswers } from 'src/application/usecases/services/answers.service';
import { MatchCache } from 'src/interface-adapters/cache/match-cache';
import { IMatchCache } from 'src/application/interfaces/cache/IGameCache';
import redis from './config/redis-client';
import { MatchmakingService } from 'src/application/usecases/services/matchmaking.service';
import { IMatchmakingCache } from 'src/application/interfaces/cache/IMatchmakingCache';
import { IEloRepository } from 'src/application/interfaces/repositories/IEloRepository';
import { IUserRepository } from 'src/application/interfaces/repositories/IUserRepository';
import { MarkingService } from 'src/application/usecases/services/marking/marking.service';
import { initDB } from 'src/application/usecases/init-db';
import { LifeSystem } from 'src/application/usecases/systems/life.system';
import { MatchCompletionSystem } from 'src/application/usecases/systems/match-completion.system';
import { SubmissionSystem } from 'src/application/usecases/systems/submission.system';
import { World } from 'src/entities/World';
import { MatchmakingCache } from 'src/interface-adapters/cache/matchmaking-cache';
import { EloRepository } from 'src/interface-adapters/repositories/elo.repository';
import { UserRepository } from 'src/interface-adapters/repositories/user.repository';

import { Users } from "../entities/database/user.entities"
import { validateToken } from '../interface-adapters/auth/auth.service';

import { createApp } from './app';
import { AppDataSource } from "./config/data-source"
import { OpponentProgress } from 'src/application/usecases/systems/opponent-progress';
import { IMatchRepository } from 'src/application/interfaces/repositories/IMatchRepository';
import { MatchRepository } from 'src/interface-adapters/repositories/match.repository';
import { Matches, MatchLog } from 'src/entities/database/match.entities';
import { MatchResultService } from 'src/application/usecases/services/match/match-result.service';
import { IMatchResultRepository } from 'src/application/interfaces/repositories/IMatchResultRepository';
import { MatchResultRepository } from 'src/interface-adapters/repositories/match-result.repository';
import { MatchConfirmationService } from 'src/application/usecases/services/match/match-confirmation.service';
import { MatchStore } from 'src/application/usecases/services/match/match-store.service';
import { DeleteGame } from 'src/application/usecases/systems/delete-game';
import { LeaderboardService } from 'src/application/usecases/services/leaderboard.service';
import { NotificationService } from 'src/application/usecases/services/notification.service';
import { MarkingStrategy } from 'src/application/interfaces/marking/IMarkingStategy';
import { MarkMaths } from 'src/application/usecases/services/marking/mark-maths';
import { MarkProg } from 'src/application/usecases/services/marking/mark-prog';
import { CodeExecutor } from 'src/interface-adapters/CodeExecutor';
import { MatchStats } from 'src/entities/database/match-stats.entities';
import { MatchStatsRepository } from 'src/interface-adapters/repositories/match-stats.repository';
import { Achievement } from 'src/entities/database/achievement.entities';
import { AchievementService } from 'src/application/usecases/services/achievement.service';
import { AchievementRepository } from 'src/interface-adapters/repositories/achievement.repository';
import { MatchHistoryRepository } from 'src/interface-adapters/repositories/match-history.repository';
import { FriendService } from 'src/application/usecases/services/friend.service';
import { FriendRepository } from 'src/interface-adapters/repositories/friend.repository';
import { FriendInvite, Friendship } from 'src/entities/database/friendship.entities';
import { IMatchStatsRepository } from 'src/application/interfaces/repositories/IMatchStatsRepository';
import { IAchievementRepository } from 'src/application/interfaces/repositories/IAchievementRepository';
import { attachSocketModules } from './socket';
import { MatchStart } from 'src/application/usecases/services/match/match-start.service';
import { ShopItemService } from 'src/application/usecases/services/shop/shop-item.service';
import { ShopItemRepository } from 'src/interface-adapters/repositories/shop-item.repository';
import { ShopItem } from 'src/entities/database/shop-item.entities';
import { Wallet } from 'src/entities/database/wallet.entities';
import { UserItem } from 'src/entities/database/user-item.entities';
import { EquippedItems } from 'src/entities/database/equipped-items.entities';
import { InventoryRepository } from 'src/interface-adapters/repositories/inventory.repository';
import { WalletReposiroty } from 'src/interface-adapters/repositories/wallet.repository';
import { EquippedRepository } from 'src/interface-adapters/repositories/equipped.repository';
import { InventoryService } from 'src/application/usecases/services/shop/inventory.service';
import { WalletService } from 'src/application/usecases/services/shop/wallet.service';
import { EquipmentService } from 'src/application/usecases/services/shop/equipment.service';
import { PowerupService } from 'src/application/usecases/services/shop/powerup.service';
import { PurchaseService } from 'src/application/usecases/services/shop/purchase.service';

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
        const match_stats_repo: IMatchStatsRepository = new MatchStatsRepository(AppDataSource.getRepository(MatchStats));
        const achievementRepo: IAchievementRepository = new AchievementRepository(AppDataSource.getRepository(Achievement), AppDataSource.getRepository(Users));

        const match_history_repo = new MatchHistoryRepository(AppDataSource.getRepository(Matches), AppDataSource.getRepository(MatchLog), AppDataSource.getRepository(MatchStats));
        const friend_repo = new FriendRepository(AppDataSource.getRepository(Friendship), AppDataSource.getRepository(FriendInvite), elo_repo);
        const shop_item_repo = new ShopItemRepository(AppDataSource.getRepository(ShopItem));
        const inventory_repo = new InventoryRepository(AppDataSource.getRepository(UserItem), shop_item_repo);
        const wallet_repo = new WalletReposiroty(AppDataSource.getRepository(Wallet));
        const equipped_repo = new EquippedRepository(AppDataSource.getRepository(EquippedItems), shop_item_repo);

        // initialise ecs world 
        const world = World();

        // initialise use cases 
        const create_player_entity = new CreatePlayerEntity(world);
        const create_match_entity = new CreateMatchEntity(world);
        const create_round_entity = new CreateRound();


        const get_questions = new GetQuestions(question_repo);
        const get_answers = new GetAnswers(answer_repo);
        const get_difficulty = new GetDifficulty();
        const get_total_time = new GetTotalTime();

        const create_match = new MatchCreationSystem(create_player_entity, create_match_entity, create_round_entity);

        // create game cache
        const match_cache: IMatchCache = new MatchCache(redis);
        const matchmaking_cache: IMatchmakingCache = new MatchmakingCache(redis);


        // initialise services 
        const match_service = new MatchCreationService(create_match, get_questions, get_difficulty, get_total_time, get_answers, match_cache, match_repo, user_repo);
        const matchmaking_service = new MatchmakingService(matchmaking_cache);
        const match_results = new MatchResultService(elo_repo, match_results_repo)
        const matched_users_service = new MatchConfirmationService();
        const match_store = new MatchStore(user_repo);
        const leaderboard_service = new LeaderboardService(elo_repo);
        const friends_service = new FriendService(friend_repo);
        const achievement_service = new AchievementService(achievementRepo);
        const match_start = new MatchStart(match_service,match_store);        
        const shop_item_service = new ShopItemService(shop_item_repo);
        const inventory_service = new InventoryService(inventory_repo);
        const wallet_service = new WalletService(wallet_repo);
        const equipment_service = new EquipmentService(equipped_repo, inventory_repo, shop_item_repo);
        const powerup_service = new PowerupService(inventory_repo, shop_item_repo);
        const purchase_service = new PurchaseService(shop_item_repo, AppDataSource);


        // initialise systems 
        const submission_system = new SubmissionSystem(world);
        const life_system = new LifeSystem(world);
        const match_deletion_system = new DeleteGame(world, match_store, matched_users_service);
        const match_completion_system = new MatchCompletionSystem(world, match_results, match_store, match_stats_repo, achievement_service, user_repo);



        const app = createApp(elo_repo, user_repo, match_history_repo, leaderboard_service, achievement_service, friends_service, shop_item_service, inventory_service, wallet_service, equipment_service, powerup_service, purchase_service, equipped_repo, shop_item_repo);
        const httpServer = createServer(app)     // can update to https
        const io = new Server(httpServer, {
            cors: {
                origin: [process.env.FRONTEND_URL!, 'http://localhost:5173'],
                credentials: true
            },
        }
        );


        const maths_marker: MarkingStrategy = new MarkMaths();

        const code_executor = new CodeExecutor();
        const prog_marker: MarkingStrategy = new MarkProg(code_executor);

        const notification = new NotificationService(io);
        const opponent_progress = new OpponentProgress(world);
        const math_marking_service = new MarkingService(match_cache, submission_system, life_system, notification, maths_marker, opponent_progress);
        const prog_marking_service = new MarkingService(match_cache, submission_system, life_system, notification, prog_marker, opponent_progress);

        // auth middleware 
        io.use(async (socket, next) => {
            try {
                const token = socket.handshake.auth.token;

                if (!token) return next(new Error("Authenticaion error: No token provided"));

                const valid = await validateToken(token)
                if (!valid) return next(new Error("Authentication error: Invalid token")) // token aint working

                // getting db id from cognito id
                const db_id = (await user_repo.getUserId(valid.user_Id))?.user_id;
                if (!db_id) return next(new Error("Authentication error: User DB ID Not found")) // db id not found

                const user = (await user_repo.getUserData(db_id, 'username'))
                // if (!(await user_repo.getUserData(db_id, 'username'))) return next(new Error("Authentication error: User not found")) // user not found, not necessarily username innit
                if (!user) return next(new Error("Authentication error: User not found")) // user not found, not necessarily username innit

                socket.data = {
                    user_id: db_id,
                    username: user.username
                }
                next();
            } catch (error) {
                console.error('Socket authorisation error: ', error);
                next(new Error("Authentication error: missing values"));
            }
        })

        // initialise database with users and elos
        await initDB(user_repo, elo_repo);

        // attach socket handlers
        attachSocketModules(io, {
            match: { math_marking_service, prog_marking_service, submission_system, match_completion_system, match_deletion_system, match_store },
            matchmaking: { matchmaking_service, matched_users_service, match_service, match_store, user_repo, match_start },
            friends: {}
        })

        // start server
        httpServer.listen(process.env.PORT, () => {
            console.log(`Server listening`)
        });
    }).catch(error => console.error(error))
