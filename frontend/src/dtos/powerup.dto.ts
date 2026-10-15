export interface UsePowerupDTO {
    match_id: number;
    shop_item_id: string;
    target_user_id?: string;    
}

export interface UsePowerupResultDTO {
    applied: boolean;
    effect: string;
    match_id: number;
    user_id: string;
    target_user_id?: string;
    duration_seconds?: number;
}

export interface UsePowerupSocketDTO { match_id: string; shop_item_id: string }
export interface LifeUpdateDTO { player_id: string; life: number }