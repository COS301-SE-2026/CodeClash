import { WalletDTO } from "src/entities/dtos/shop/wallet.dto";

export interface IWalletRepository {
    getWallet(user_id: string): Promise<WalletDTO | null>;
    createWallet(user_id: string): Promise<WalletDTO>;
    updateBalance(user_id: string, delta: number): Promise<WalletDTO>;

}