

export interface IAnswerRepository {

    getAnswer(question_id: string): Promise<string | null>
    getAnswers(question_ids: string[]): Promise<string[] | null>
}