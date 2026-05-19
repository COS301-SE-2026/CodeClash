class QuestionDTO {
    id: string;
    title: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard';
    language: string;

    constructor(id: string, title: string, description: string, difficulty: 'easy' | 'medium' | 'hard', language: string) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.difficulty = difficulty;
        this.language = language;
    }
}

export default QuestionDTO;