import { describe, expect, it, beforeAll, afterAll } from "vitest";
import { DataSource } from "typeorm";
import { randomUUID } from "node:crypto";
import { createTestDataSource } from "../../test-data-source";
import { ShopItem } from "../../../src/entities/database/shop-item.entities";
import { Wallet } from "../../../src/entities/database/wallet.entities";
import { UserItem } from "../../../src/entities/database/user-item.entities";
import { Users } from "../../../src/entities/database/user.entities";
import { ShopItemRepository } from "../../../src/interface-adapters/repositories/shop-item.repository";
import { WalletReposiroty } from "../../../src/interface-adapters/repositories/wallet.repository";
import { UserRepository } from "../../../src/interface-adapters/repositories/user.repository";
import { PurchaseService } from "../../../src/application/usecases/services/shop/purchase.service";
import { IUserRepository } from "../../../src/application/interfaces/repositories/IUserRepository";
import { mock_shop_items } from "../../mocks/mock-shop-items";
import { after, before } from "node:test";

let data_source: DataSource;
let purchase_service: PurchaseService;
let shop_item_repo: ShopItemRepository;
let wallet_repo: WalletReposiroty;
let user_repo: IUserRepository;

let user_id: string;
const cognito_id = randomUUID();
const username = `purchase_test_${randomUUID()}`;
let item_ids: string[] = [];

describe('Tests PurchaseService', () => {
    beforeAll(async () => {
        data_source = await createTestDataSource();
        shop_item_repo = new ShopItemRepository(data_source.getRepository(ShopItem));
        wallet_repo = new WalletReposiroty(data_source.getRepository(Wallet));
        user_repo = new UserRepository(data_source.getRepository(Users));
        purchase_service = new PurchaseService(shop_item_repo, data_source);

        const user = await user_repo.createUser(username, `${username}@example.com`, cognito_id, 0, 'Mercury');
        user_id = user.user_id!;

        const saved = await data_source.getRepository(ShopItem).save(mock_shop_items);
        item_ids = saved.map(i => i.shop_item_id);

        await wallet_repo.createWallet(user_id);
    });

    afterAll(async () => {
        await data_source.getRepository(UserItem).delete({ user: { user_id } });
        await data_source.getRepository(Wallet).delete({ user: { user_id } });
        await data_source.getRepository(ShopItem).delete(item_ids);
        await data_source.getRepository(Users).delete({ cognito_id });
    });

    it('Deducts price and grants the item atomically', async () => {
        await wallet_repo.updateBalance(user_id, 500);
        const item_id = item_ids.find((_, i) => mock_shop_items[i]!.category === 'powerup')!;

        const result = await purchase_service.purchaseItem(user_id, item_id);

        expect(result.item.item.shop_item_id).toBe(item_id);

        const wallet = await wallet_repo.getWallet(user_id);
        expect(wallet!.balance).toBe(400); 
    });

    it('Throws and does not deduct balance when item is already owned', async () => {
        
    });

    it('Throws and does not deduct balance when balance is insufficient', async () => {

    });

    it('Throws when item does not exist', async () => {

    });
});
