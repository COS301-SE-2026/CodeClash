
export interface Player{
    id:string,
    life: number,
    avatar_id: number,
    questions_answered: number,
    username:string
}

export interface Answer{
    player_id: number,
    question_number: number,
    round_number:number,
    answer: string
}

export interface Question{
    id?: string,
    title?: string,
    difficulty?: string,
    description?: string,
    number?: number
}

export interface MatchProgress{
    player_progress: number [];
    question_number: number
}