import { IAnswerRepository } from "../../interfaces/repositories/IAnswerRepository";

export class GetAnswers {
    constructor(
        private readonly answer_repo: IAnswerRepository
    ) { }

    async execute(questions: string[]) {
        console.log("LINE 11 Answer service")
        const answers = await this.answer_repo.getAnswers(questions)

        console.log(answers)

        return answers
    }
}