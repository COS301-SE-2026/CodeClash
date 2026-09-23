import { Repository } from "typeorm";
import { Wallet } from "src/entities/database/wallet.entities";
import { IWalletRepository } from "src/application/interfaces/repositories/IWalletRepository";
import { WalletDTO } from "src/entities/dtos/shop/wallet.dto";

export class WalletReposiroty implements IWalletRepository {
    constructor ( private readonly walletRepo: Repository<Wallet>) {}

    // copied from old file
    private toDTO(wallet: Wallet): WalletDTO {
        return {
            wallet_id: wallet.wallet_id,
            user_id: wallet.user.user_id,
            balance: wallet.balance,
            updated_at: wallet.updated_at
        };
    }

    async getWallet(user_id: string): Promise<WalletDTO | null> {
        const wallet = await this.walletRepo.findOne({
            where: { user: { user_id} },
            relations: { user: true }
        });
        return wallet ? this.toDTO(wallet) : null;
    }

    async createWallet(user_id: string): Promise<WalletDTO> {
        await this.walletRepo.save(this.walletRepo.create({
            user: { user_id } as any,
            balance: 0
        }));
        return this.getWallet(user_id) as Promise<WalletDTO>;
    }

    async updateBalance(user_id: string, delta: number): Promise<WalletDTO> {
        const wallet = await this.walletRepo.findOne({ where: { user: { user_id } } });
        if(!wallet) throw new Error('wallet not found');

        const newBalance = wallet.balance + delta;
        if (newBalance < 0) throw new Error('Insufficient balance');

        await this.walletRepo.update({ wallet_id: wallet.wallet_id }, { balance: newBalance });
        return this.getWallet(user_id) as Promise<WalletDTO>;
    }

}