import { GetAnswers } from '../../../src/application/usecases/services/answers.service';
import { MatchCreationService } from '../../../src/application/usecases/services/match/match-creation.service';
import { GetQuestions, GetTotalTime } from '../../../src/application/usecases/services/questions.service';
import { CreateMatchEntity, CreatePlayerEntity, CreateRound, MatchCreationSystem } from '../../../src/application/usecases/systems/match-creation.system'
import { MatchMode } from "../../../src/entities/dtos/match/match.dto";
import { PlayerDTO } from "../../../src/entities/dtos/components.dto";
import { vi, describe, test, expect, afterEach, beforeAll, afterAll } from "vitest";
import { World } from '../../../src/entities/World';
import { createTestDataSource } from '../../test-data-source';
import { IQuestionRepository } from '../../../src/application/interfaces/repositories/IQuestionRepository';
import { QuestionRepository } from '../../../src/interface-adapters/repositories/question.repository';
import { IAnswerRepository } from '../../../src/application/interfaces/repositories/IAnswerRepository';
import { AnswerRepository } from '../../../src/interface-adapters/repositories/answer.repository';
import { MatchCache } from '../../../src/interface-adapters/cache/match-cache';
import redis from '../../../src/frameworks-drivers/config/redis-client'
import { IMatchRepository } from '../../../src/application/interfaces/repositories/IMatchRepository';
import { MatchRepository } from '../../../src/interface-adapters/repositories/match.repository';
import { Matches } from '../../../src/entities/database/match.entities';
import { Questions } from '../../../src/entities/database/questions.entities';
import { Answers } from '../../../src/entities/database/answers.entities';
import { IUserRepository } from '../../../src/application/interfaces/repositories/IUserRepository';
import { UserRepository } from '../../../src/interface-adapters/repositories/user.repository';
import { Users } from '../../../src/entities/database/user.entities';
import { randomUUID } from 'node:crypto';
import type { UserDTO } from '../../../src/entities/dtos/users/user.dto'
import { RoundComponent } from '../../../src/entities/components';
import { AnswerDTO } from '../../../src/entities/dtos/match/answer.dto';

const world = World();

const data_source = await createTestDataSource();
const question_repo: IQuestionRepository = new QuestionRepository(data_source.getRepository(Questions));
const answer_repo: IAnswerRepository = new AnswerRepository(data_source.getRepository(Answers));
const user_repo: IUserRepository = new UserRepository(data_source.getRepository(Users));
const match_repo: IMatchRepository = new MatchRepository(data_source.getRepository(Matches), user_repo);

const create_game = new MatchCreationSystem(new CreatePlayerEntity(world), new CreateMatchEntity(world), new CreateRound());
const get_questions = new GetQuestions(question_repo);
const get_total_time = new GetTotalTime();
const get_answers = new GetAnswers(answer_repo);
const match_cache = new MatchCache(redis);


const game_service = new MatchCreationService(
    create_game as unknown as MatchCreationSystem,
    get_questions as unknown as GetQuestions,
    get_total_time as unknown as GetTotalTime,
    get_answers as unknown as GetAnswers,
    match_cache,
    match_repo,
    user_repo
)



let player_1: PlayerDTO;
const p1_cognito = randomUUID()
const p1_username = "player 1";

let player_2: PlayerDTO;
const p2_cognito = randomUUID();
const p2_username = "player 2";

const avg = (606 + 832) / 2;

let match: {
    match_entity: number,
    match_id: string,
    rounds: RoundComponent[],
    answers: AnswerDTO[]
};


describe("Tests Match Creation", () => {

    beforeAll(async () => {
        const save_p1: UserDTO = await user_repo.createUser(p1_username, 'player1@example.com', p1_cognito, 0, 'Mercury');
        const save_p2: UserDTO = await user_repo.createUser(p2_username, 'player2@example.com', p2_cognito, 0, 'Mercury');

        player_1 = {
            id: save_p1.user_id!,
            username: p1_username,
            elo: 606
        }

        player_2 = {
            id: save_p2.user_id!,
            username: p2_username,
            elo: 606
        }

    });

    afterAll(async () => {
        await data_source.getRepository(Matches).delete({ match_id: match.match_id });
        await data_source.getRepository(Users).delete({ cognito_id: p1_cognito });
        await data_source.getRepository(Users).delete({ cognito_id: p2_cognito });
    })

    afterEach(() => {
        vi.clearAllMocks()
    })
    test("Creates Maths games for two players on Mercury", async () => {
        match = await game_service.execute([player_1, player_2], MatchMode.Maths, "Mercury", 'ranked')

        expect(match).toBeDefined();
        expect(match.match_id).toBeDefined();

    })


    test("Testing failure branches", async () => {
        await expect(game_service.execute([player_1, player_2], MatchMode.Maths, "Not A League", 'ranked')).rejects.toThrow("League not found")
    })
})
