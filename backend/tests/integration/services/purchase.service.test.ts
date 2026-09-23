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

    });

    afterAll(async () => {

    });

    it('Deducts price and grants the item atomically', async () => {

    });

    it('Throws and does not deduct balance when item is already owned', async () => {

    });

    it('Throws and does not deduct balance when balance is insufficient', async () => {

    });

    it('Throws when item does not exist', async () => {

    });
});
