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

}