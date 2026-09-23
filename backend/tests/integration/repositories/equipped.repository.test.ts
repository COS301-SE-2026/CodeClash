import { describe, expect, it, beforeAll, afterAll } from "vitest";
import { DataSource } from "typeorm";
import { randomUUID } from "node:crypto";
import { createTestDataSource } from "../../test-data-source";
import { ShopItem } from "../../../src/entities/database/shop-item.entities";
import { EquippedItems } from "../../../src/entities/database/equipped-items.entities";
import { Users } from "../../../src/entities/database/user.entities";
import { ShopItemRepository } from "../../../src/interface-adapters/repositories/shop-item.repository";
import { EquippedRepository } from "../../../src/interface-adapters/repositories/equipped.repository";
import { UserRepository } from "../../../src/interface-adapters/repositories/user.repository";
import { IUserRepository } from "../../../src/application/interfaces/repositories/IUserRepository";
import { mock_shop_items } from "../../mocks/mock-shop-items";

let data_source: DataSource;
let repo: EquippedRepository;
let shop_item_mapper: ShopItemRepository;
let user_repo: IUserRepository;

let user_id: string;
const cognito_id = randomUUID();
const username = `equipped_test_${randomUUID}`;
let item_ids: string[] = [];

describe('Tests EquippedRespository', () => {
    beforeAll(async () => {

    });

    afterAll(async () => {

    });

    it('Returns null before any items are equipped', async () => {

    });

    it('Creates an equipped row on first update', async () => {

    });

    it('Updates one slot without clearing another', async () => {

    });

    it('Replaces a previously equipped item in the same slot', async () => {

    });
});