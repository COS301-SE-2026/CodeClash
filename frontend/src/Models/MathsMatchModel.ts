
export interface Player{
    life: number,
    avatar: string,
    questions_answered: number,
}

export interface Answer{
    player_id: number,
    question_number: number,
    round_number:number,
    answer: string
}

export interface Question{
    title: string,
    difficulty: string,
    description: string,
    question: string,
    number: number
}

export interface MatchProgress{
    player_progress: number [];
    question_number: number
}