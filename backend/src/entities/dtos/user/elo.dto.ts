export interface EloDTO{
    user_id?: string,
    rating?: number
}

export interface EloUpdateResultDTO {
    user_id: string;
    old_rating: number;
    new_rating: number;
    elo_gained: number;
}