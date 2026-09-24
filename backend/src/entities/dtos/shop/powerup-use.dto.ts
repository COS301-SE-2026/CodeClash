export interface UsePowerupDTO {
    match_id: string;
    shop_item_id: string;
    target_user_id?: string;
}

export interface UsePowerupResultDTO {
    applied: boolean;
    effect: string;
    match_id: string;
    user_id: string;
    target_user_id?: string;
}