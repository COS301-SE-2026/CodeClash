import { Server } from 'socket.io'
import { io } from 'socket.io-client';
import { createServer, type Server as HttpServer } from 'http'
import { createTestDataSource } from '../../test-data-source';
import { IUserRepository } from '../../../src/application/interfaces/repositories/IUserRepository';
import { UserRepository } from '../../../src/interface-adapters/repositories/user.repository';
import { Users } from '../../../src/entities/database/user.entities';
import { PlayerDTO } from '../../../src/entities/dtos/matches/match-component.dto';
import { MatchCreationSystem, CreateMatchEntity, CreatePlayerEntity, CreateRound } from '../../../src/application/usecases/systems/match-creation.system';
import { MatchCreationService } from '../../../src/application/usecases/services/match/match-creation.service';
import { World } from '../../../src/entities/World';
import { GetQuestions } from '../../../src/application/usecases/services/questions.service';
import { GetAnswers } from '../../../src/application/usecases/services/answers.service';
import { GetTotalTime } from '../../../src/application/usecases/services/questions.service';
import { MatchCache } from '../../../src/interface-adapters/cache/match-cache';
import redis from '../../../src/frameworks-drivers/config/redis-client'
import { IQuestionRepository } from '../../../src/application/interfaces/repositories/IQuestionRepository';
import { QuestionRepository } from '../../../src/interface-adapters/repositories/question.repository';
import { IAnswerRepository } from '../../../src/application/interfaces/repositories/IAnswerRepository';
import { AnswerRepository } from '../../../src/interface-adapters/repositories/answer.repository';
import { Questions } from '../../../src/entities/database/questions.entities';
import { Answers } from '../../../src/entities/database/answers.entities';
import { IMatchRepository } from '../../../src/application/interfaces/repositories/IMatchRepository';
import { MatchRepository } from '../../../src/interface-adapters/repositories/match.repository';
import { Matches } from '../../../src/entities/database/match.entities';
import { MatchMode, MatchType } from '../../../src/entities/dtos/matches/match.dto';
import { MatchCompletionService } from '../../../src/application/usecases/services/match/match-completion.service';
import { MatchCompletionSystem } from '../../../src/application/usecases/systems/match-completion.system';
import { MatchStore } from '../../../src/application/usecases/services/match/match-store.service';
import { AchievementService } from '../../../src/application/usecases/services/achievement.service';
import { IAchievementRepository } from '../../../src/application/interfaces/repositories/IAchievementRepository'
import { AchievementRepository } from '../../../src/interface-adapters/repositories/achievement.repository'
import { Achievement } from '../../../src/entities/database/achievement.entities';
import { RoundComponent } from '../../../src/entities/components';
import { AnswerDTO } from '../../../src/entities/dtos/questions/answer.dto';
import { mock_questions } from '../../mocks/mock-questions';
import { mock_answers } from '../../mocks/mock-answers';

let http: HttpServer;
let server: Server;

const data_source = await createTestDataSource();
const user_repo: IUserRepository = new UserRepository(data_source.getRepository(Users));
const world = World()
const match_repo: IMatchRepository = new MatchRepository(data_source.getRepository(Matches), data_source.getRepository(Users));


export const createTestServer = async (players: PlayerDTO[]) => {
    for (const p of players) {
        const user = await user_repo.createUser(p.username!, `${p.username}@email.com`, crypto.randomUUID(), 0, 'Mercury')
        p.id = user.user_id;
    }

    http = createServer();
    server = new Server(http);

    server.use((socket, next) => {
        const user_id = socket.handshake.auth.user_id;

        const player = players.find(p => p.id === user_id);
        if (!player) return next(new Error("Authentication error: User DB ID Not found"))

        socket.data.user_id = player.id;
        socket.data.username = player.username;
        next();
    });


    await new Promise<void>((resolve) => {
        http.listen(0, resolve);
    })

    return { server, http };
}

export const test_match_creation = async () => {
    const question_repo: IQuestionRepository = new QuestionRepository(data_source.getRepository(Questions));
    const answer_repo: IAnswerRepository = new AnswerRepository(data_source.getRepository(Answers))

    await data_source.getRepository(Questions).save(mock_questions);
    await data_source.getRepository(Answers).save(mock_answers);

    const create_player_entity = new CreatePlayerEntity(world);
    const create_match_entity = new CreateMatchEntity(world);
    const create_rounds = new CreateRound();

    const get_questions = new GetQuestions(question_repo);
    const get_answers = new GetAnswers(answer_repo);
    const get_total_time = new GetTotalTime();

    const match_cache = new MatchCache(redis);
    const create_game = new MatchCreationSystem(create_player_entity, create_match_entity, create_rounds);
    const match_service = new MatchCreationService(create_game, get_questions, get_total_time, get_answers, match_cache, match_repo, user_repo);

    return match_service;
}

export const createTestMatch = async (players: PlayerDTO[], match_mode: MatchMode, match_type: MatchType) => {

    const match_service = await test_match_creation();
    const match = await match_service.execute(players, match_mode, 'Mercury', match_type);

    return match
}

export const deleteTestMatch = (players: string[], match_type: MatchType,
    match: {
        match_entity: number,
        match_id: string,
        rounds: RoundComponent[],
        answers: AnswerDTO[]
    }) => {
    console.log(match);
    const achievement_repo: IAchievementRepository = new AchievementRepository(data_source.getRepository(Achievement), data_source.getRepository(Users));

    const match_store = new MatchStore(user_repo);
    const completion_system = new MatchCompletionSystem(world, match_store);
    const achievement_service = new AchievementService(achievement_repo, user_repo);

    const delete_match = new MatchCompletionService(match_repo, completion_system, user_repo, achievement_service);

    delete_match.execute(match.match_entity, match.match_id, players, match_type);
}


export const socketSetup = async (player_id:string) => {
    const address = http.address();

    if (!address || typeof address === 'string') throw new Error("Server not running");

    const socket = io(`http://localhost:${address.port}`, {
        auth: {
            user_id: player_id
        }
    });

    await new Promise<void>((resolve, reject) => {
        socket.on("connect", () => resolve());
        socket.on("connect_error", reject);
    })

    return socket;
}