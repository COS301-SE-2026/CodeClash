import { describe, expect, it, beforeAll, afterAll } from "vitest";
import { DataSource } from "typeorm";
import { randomUUID } from "node:crypto";
import { createTestDataSource } from "../../test-data-source";
import { ShopItem } from "../../../src/entities/database/shop-item.entities";
import { UserItem } from "../../../src/entities/database/user-item.entities";
import { Users } from "../../../src/entities/database/user.entities"; 
import { ShopItemRepository } from "../../../src/interface-adapters/repositories/shop-item.repository";
import { InventoryRepository } from "../../../src/interface-adapters/repositories/inventory.repository";
import { UserRepository } from "../../../src/interface-adapters/repositories/user.repository";
import { IUserRepository } from "../../../src/application/interfaces/repositories/IUserRepository";
import { mock_shop_items } from "../../mocks/mock-shop-items";

let data_source: DataSource;
let repo: InventoryRepository;
let shop_item_mapper: ShopItemRepository;
let user_repo: IUserRepository;

let user_id: string;
const cognito_id = randomUUID();
const username = `equipped_test_${randomUUID}`;
let item_ids: string[] = [];

describe('Tests InventoryRepository', () =>{
    beforeAll(async () => {

    });

    afterAll(async () => {

    });

    it('Grants and returns an owned item', async () => {

    });

    it('Confirms hasItem is true for an owned item', async () => {

    });

    it('Returns only powerup-category items from getUserPowerups', async () => {

    });
});