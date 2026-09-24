import { IShopItemRepository } from "src/application/interfaces/repositories/IShopItemRepository";
import { PurchaseResultDTO } from "src/entities/dtos/shop/purchase-result.dto";
import { Wallet } from "src/entities/database/wallet.entities";
import { UserItem } from "src/entities/database/user-item.entities";
import { DataSource } from "typeorm";

export class PurchaseService {
    constructor (
        private readonly shop_item_repo: IShopItemRepository,
        private readonly dataSource: DataSource
    ) {}

     async purchaseItem(user_id: string, shop_item_id: string): Promise< PurchaseResultDTO> {
        const item = await this. shop_item_repo.getItemById(shop_item_id);
        if (!item) throw new Error('Item not found');

        return this.dataSource.transaction(async (manager) => {
            const walletRepo = manager.getRepository(Wallet);
            const userItemRepo = manager.getRepository(UserItem);

            const alreadyOwned = await userItemRepo.count({
                where: { user: { user_id }, shop_item: { shop_item_id } }
            });
            if(alreadyOwned > 0) throw new Error('Item already owned');

            const wallet = await walletRepo.findOne({ where: { user: { user_id } } });
            if(!wallet) throw new Error('Wallet not found');
            if (wallet.balance < item.price) throw new Error('Insufficient balance');

            await walletRepo.update({ wallet_id: wallet.wallet_id }, { balance: wallet.balance - item.price });

            const userItem = await userItemRepo.save(userItemRepo.create({
                user: { user_id } as any,
                shop_item: { shop_item_id } as any
            }));

            return {
                wallet: { wallet_id: wallet.wallet_id, user_id, balance: wallet.balance - item.price, updated_at: new Date() },
                item: { user_item_id: userItem.user_item_id, user_id, item, acquired_at:userItem.acquired_at }
            };
        });
    }
}