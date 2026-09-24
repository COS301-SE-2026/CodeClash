import { IWalletRepository } from "src/application/interfaces/repositories/IWalletRepository";
import { WalletDTO } from "src/entities/dtos/shop/wallet.dto";

export class WalletService {
    constructor(private readonly wallet_repo: IWalletRepository) {}

    async getWallet(user_id: string) : Promise<WalletDTO> {
        let wallet = await this.wallet_repo.getWallet(user_id);
        if (!wallet) wallet = await this.wallet_repo.createWallet(user_id);
        return wallet;
    }

    async earnCurrency(user_id: string, amount: number): Promise<WalletDTO> {
        const existing = await this.wallet_repo.getWallet(user_id);
        if (!existing) await this.wallet_repo.createWallet(user_id);
        return this.wallet_repo.updateBalance(user_id, amount);
    }
}