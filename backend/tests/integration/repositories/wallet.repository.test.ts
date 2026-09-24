import { describe, expect, it, beforeAll, afterAll } from "vitest";
import { DataSource } from "typeorm";
import { randomUUID } from "node:crypto";
import { createTestDataSource } from "../../test-data-source";
import { Wallet } from "../../../src/entities/database/wallet.entities";
import { Users } from "../../../src/entities/database/user.entities";
import { WalletReposiroty } from "../../../src/interface-adapters/repositories/wallet.repository";
import { UserRepository } from "../../../src/interface-adapters/repositories/user.repository";
import { IUserRepository } from "../../../src/application/interfaces/repositories/IUserRepository";

let data_source: DataSource;
let repo: WalletReposiroty;
let user_repo: IUserRepository;

let user_id: string;
const cognito_id = randomUUID();
const username = `equipped_test_${randomUUID}`;

describe('Tests WalletRepository', () => {
    beforeAll(async () => {
        data_source = await createTestDataSource();
        repo = new WalletReposiroty(data_source.getRepository(Wallet));
        user_repo = new UserRepository(data_source.getRepository(Users));

        const user = await user_repo.createUser(username, `${username}@example.com`, cognito_id, 0, 'Mercury');
        user_id = user.user_id!;
    });

    afterAll(async () => {
        await data_source.getRepository(Wallet).delete({ user: { user_id } });
        await data_source.getRepository(Users).delete({ cognito_id });
    });

    it('Returns null when the user has no wallet yet', async () => {
        const wallet = await repo.getWallet(user_id);

        expect(wallet).toBeNull();
    });

    it('Creates a wallet with zero balance', async () => {
        const wallet = await repo.createWallet(user_id);

        expect(wallet.balance).toBe(0);
        expect(wallet.user_id).toBe(user_id);
    });

    it('Increases balance with a positive delta', async () => {
        const wallet = await repo.updateBalance(user_id, 150);

        expect(wallet.balance).toBe(150);
    });

    it('Throws when balance would go negative', async () => {
        await expect(repo.updateBalance(user_id, -1000)).rejects.toThrow('Insufficient balance');
    });
});