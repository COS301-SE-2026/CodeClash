import { GameService } from 'src/application/usecases/services/game.service'
import { GameMode } from "src/entities/db-entities/questions.entities";
import { AnswerDTO } from 'src/entities/dtos/answer.dto'
import { PlayerDTO } from "src/entities/dtos/components.dto";
import { QuestionDTO } from 'src/entities/dtos/question.dto'
import { vi, describe, test, expect, afterEach } from "vitest";

const mock_dependencies = () => ({ execute: vi.fn() });


const mock_create_game = mock_dependencies();
const mock_get_questions = mock_dependencies();
const mock_get_difficulty = mock_dependencies();
const mock_get_total_time = mock_dependencies();
const mock_get_answers = mock_dependencies();
const mock_game_cache = () => ({
    saveGame: vi.fn(),
    saveAnswer: vi.fn(),
    getAnswer: vi.fn()
})

const mock_match_repo = () => ({
    createMatch: vi.fn()
})

const mock_user_repo = () => ({
    getUserData: vi.fn()
})

const user_repo = mock_user_repo();
user_repo.getUserData.mockResolvedValue({username: 'player'})

let ids = 1;

const game_service = new GameService(
    mock_create_game,
    mock_get_questions,
    mock_get_difficulty,
    mock_get_total_time,
    mock_get_answers,
    mock_game_cache(),
    mock_match_repo(),
    user_repo
)


// mock questions 
const easy: QuestionDTO = {
    id: "easy-01",
    category: GameMode.Maths,
    difficculty: 1,
    title: "Mock Easy Question",
    description: "this is an easy mock question for testing",
    time_limit: "00:02:00"
}
const medium: QuestionDTO = {
    id: "medium-01",
    category: GameMode.Maths,
    difficculty: 2,
    title: "Mock Medium Question",
    description: "this is an medium mock question for testing",
    time_limit: "00:02:00"
}
const hard: QuestionDTO = {
    id: "hard-01",
    category: GameMode.Maths,
    difficculty: 3,
    title: "Mock Hard Question",
    description: "this is an hard mock question for testing",
    time_limit: "00:02:00"
}

const mock_questions = {
    easy: [easy],
    medium: [medium],
    hard: [hard]
}

// mock answers 

const easy_answer: AnswerDTO = {
    answer: "Mock Easy Answer",
    question_id: "easy-01"
}

const medium_answer: AnswerDTO = {
    answer: "Mock Medium Answer",
    question_id: "medium-01"
}


const hard_answer: AnswerDTO = {
    answer: "Mock Hard Answer",
    question_id: "hard-01"
}

const mock_answers = [easy_answer, medium_answer, hard_answer]

const player_1_id = (ids++).toString()
const player_1: PlayerDTO = {
    id: player_1_id,
    username: `player ${player_1_id}`,
    elo: 606
}

const player_2_id = (ids++).toString()
const player_2: PlayerDTO = {
    id: player_2_id,
    username: `player ${player_2_id}`,
    elo: 832
}

const avg = (606 + 832) / 2;


describe("Tests Game Creation", () => {

    afterEach(() => {
        vi.clearAllMocks()
    })
    test("Creates Maths games for two players on Mercury", async () => {
        mock_get_questions.execute.mockResolvedValue(mock_questions)
        mock_get_answers.execute.mockResolvedValue(mock_answers)


        await game_service.execute([player_1, player_2], GameMode.Maths, "Mercury", 'ranked')


        expect(mock_get_questions.execute).toHaveBeenCalledWith("Mercury", avg, GameMode.Maths)
        expect(mock_get_difficulty.execute).toHaveBeenCalledWith(mock_questions);
    })


    test("Testing failure branches", async () => {
        mock_get_questions.execute.mockResolvedValue(null)
        await expect(game_service.execute([player_1, player_2], GameMode.Maths, "Not A League")).rejects.toThrow("Error fetching questions")
    })
})
