import { IAnswerRepository } from "../../interfaces/repositories/IAnswerRepository";

export class GetAnswers {
    constructor(
        private readonly answer_repo: IAnswerRepository
    ) { }

    async execute(questions: string[]) {
        const answers = await this.answer_repo.getAnswers(questions)
        return answers
    }
}