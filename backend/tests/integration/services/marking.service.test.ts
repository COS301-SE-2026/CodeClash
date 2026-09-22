import { describe, expect, vi, it, beforeAll } from 'vitest'
import { MarkingService } from '../../../src/application/usecases/services/marking/marking.service'
import { MatchCache } from '../../../src/interface-adapters/cache/match-cache'
import redis from '../../../src/frameworks-drivers/config/redis-client'
import { SubmissionSystem } from '../../../src/application/usecases/systems/submission.system'
import { World } from '../../../src/entities/World'
import { LifeSystem } from '../../../src/application/usecases/systems/life.system'
import { NotificationService } from '../../../src/application/usecases/services/notification.service'
import { Server } from 'socket.io'
import { MarkProg } from '../../../src/application/usecases/services/marking/mark-prog'
import { CodeExecutor } from '../../../src/interface-adapters/CodeExecutor'
import { OpponentProgress } from '../../../src/application/usecases/systems/opponent-progress'
import { MatchCreationService } from '../../../src/application/usecases/services/match/match-creation.service'
import { MatchCreationSystem, CreateMatchEntity, CreatePlayerEntity, CreateRound } from '../../../src/application/usecases/systems/match-creation.system'
import { GetAnswers } from '../../../src/application/usecases/services/answers.service'
import { GetQuestions } from '../../../src/application/usecases/services/questions.service'
import { GetTotalTime } from '../../../src/application/usecases/services/questions.service'
import { GetDifficulty } from '../../../src/application/usecases/services/questions.service'
import { createTestDataSource } from "../../test-data-source";
import { IQuestionRepository } from '../../../src/application/interfaces/repositories/IQuestionRepository'
import { IAnswerRepository } from '../../../src/application/interfaces/repositories/IAnswerRepository'
import { Questions } from '../../../src/entities/database/questions.entities'
import { MatchMode, MatchType } from '../../../src/entities/dtos/match/match.dto'
import { Answers } from '../../../src/entities/database/answers.entities'
import { QuestionRepository } from '../../../src/interface-adapters/repositories/question.repository'
import { AnswerRepository } from '../../../src/interface-adapters/repositories/answer.repository'
import { Matches } from '../../../src/entities/database/match.entities'
import { IMatchRepository } from '../../../src/application/interfaces/repositories/IMatchRepository'
import { MatchRepository } from '../../../src/interface-adapters/repositories/match.repository'
import { IUserRepository } from '../../../src/application/interfaces/repositories/IUserRepository'
import { UserRepository } from '../../../src/interface-adapters/repositories/user.repository'
import { Users } from '../../../src/entities/database/user.entities'
import { PlayerDTO } from '../../../src/entities/dtos/matches/match-component.dto'
import { QuestionDTO } from '../../../src/entities/dtos/questions/question.dto'
import { AnswerDTO } from '../../../src/entities/dtos/questions/answer.dto'
import { mock_questions } from '../../mocks/mock-questions'
import { mock_answers } from '../../mocks/mock-answers'
import { SubmissionComponent } from '../../../src/entities/components'
import { RoundComponent } from '../../../src/entities/components'

const io = {
    to: vi.fn().mockReturnValue({
        emit: vi.fn()
    }),
} as unknown as Server


const world = World()
const match_cache = new MatchCache(redis);
const submission_system = new SubmissionSystem(world);
const life_system = new LifeSystem(world);
const opponent_progress = new OpponentProgress(world);
const notification_service = new NotificationService(io);

const executor = new CodeExecutor();
const prog_marker = new MarkProg(executor);

const prog_marking_service = new MarkingService(match_cache, submission_system, life_system, notification_service, prog_marker, opponent_progress);

const create_player_entity = new CreatePlayerEntity(world);
const create_match_entity = new CreateMatchEntity(world);
const create_rounds = new CreateRound();

const data_source = await createTestDataSource();
const question_repo: IQuestionRepository = new QuestionRepository(data_source.getRepository(Questions));
const answer_repo: IAnswerRepository = new AnswerRepository(data_source.getRepository(Answers))
const match_repo: IMatchRepository = new MatchRepository(data_source.getRepository(Matches))
const user_repo: IUserRepository = new UserRepository(data_source.getRepository(Users));

const get_questions = new GetQuestions(question_repo);
const get_answers = new GetAnswers(answer_repo);
const get_difficulty = new GetDifficulty();
const get_total_time = new GetTotalTime();

const create_game = new MatchCreationSystem(create_player_entity, create_match_entity,create_rounds);

const match_service = new MatchCreationService(create_game, get_questions, get_difficulty, get_total_time, get_answers, match_cache, match_repo, user_repo);

const players: PlayerDTO[] = [
    {
        id: crypto.randomUUID(),
        elo: 600,
        username: 'Player 1',
        life: 100,
        done: false
    },
    {
        id: crypto.randomUUID(),
        elo: 606,
        username: 'Player 2',
        life: 100,
        done: false
    }
]

let game: {
    match_entity: number,
    match_id: string,
    rounds: RoundComponent[],
    answers: AnswerDTO[]
};




describe("Tests Marking Services", () => {

    beforeAll(async () => {
        let user;

        for (const p of players) {
            user = await user_repo.createUser(p.username!, `${p.username}@email.com`, crypto.randomUUID(), 0, 'Mercury')
            p.id = user.user_id;
        }

        await data_source.getRepository(Questions).save(mock_questions);
        await data_source.getRepository(Answers).save(mock_answers);


        game = await match_service.execute(players, MatchMode.Programming, 'Mercury', MatchType.ranked);

    })



    // it('Mark a Programming Submission', async () => {
    //     const submission = {
    //         match_id: game.match_entity,
    //         player_id: players[0].id,
    //         question_id: game.questions.medium[0].id,
    //         question_number: 1,
    //         submission: {
    //             source_code: 'print("Answer Question 5")',
    //             language_id: 71,
    //             stdin: null
    //         }
    //     }

    //     await prog_marking_service.execute(submission);
    //     const saved_submission: SubmissionComponent = submission_system.getSubmission(submission);

    //     expect(io.to).toHaveBeenCalled();
    //     expect(saved_submission.correct).toBe(true);
    // })

    // it('Rejects an incorrect submission', async () => {
    //     const submission = {
    //         match_id: game.match_entity,
    //         player_id: players[0].id,
    //         question_id: game.rounds.medium[0].id,
    //         question_number: 1,
    //         submission: {
    //             source_code: 'print("Programming marking integration test")',
    //             language_id: 71,
    //             stdin: null
    //         }
    //     }

    //     await prog_marking_service.execute(submission);
    //     const saved_submission: SubmissionComponent = submission_system.getSubmission(submission);

    //     expect(io.to).toHaveBeenCalled();
    //     expect(saved_submission.correct).toBe(false);

    // })

    it('Rejects a submission for invalid question', async () => {
        const submission = {
            match_id: game.match_entity,
            player_id: players[0].id,
            question_id: crypto.randomUUID(),
            question_number: 1,
            submission: {
                source_code: 'print("Programming marking integration test")',
                language_id: 71,
                stdin: null
            }
        }

        await expect(prog_marking_service.execute(submission)).rejects.toThrow('Invalid question id');
    })
})  