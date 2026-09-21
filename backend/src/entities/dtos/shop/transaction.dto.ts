export interface TransactionDTO {
    transaction_id: string;
    user_id: string;
    shop_item_id: string;
    amount: number;
    type: 'money_in' | 'money_out';
    created_at: Date;
}