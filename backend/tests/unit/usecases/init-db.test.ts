import { vi, describe, it, beforeEach, expect } from "vitest";
import { initDB } from '../../../src/application/usecases/init-db'
import { fetchAllCognitoUsers } from "../../../src/application/usecases/services/cognito.service";

vi.mock('../../../src/application/usecases/services/cognito.service');

const cognito_user = (username: string, email?: string, sub?: string) => ({
    Username: username,
    Attributes: [
        ...(email ? [{ Name: 'email', Value: email }] : []),
        ...(sub ? [{ Name: 'sub', Value: sub }] : [])
    ]
});

let user_repo: any;
let wallet_repo: any;
const fetchCognitoUsers = (users: unknown[]) => vi.mocked(fetchAllCognitoUsers).mockResolvedValue(users as any);

describe(" Testing user database initialisation", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        user_repo = {
            createUser: vi.fn(async (username: string) => ({ user_id: `id-${username}` }))
        };
        wallet_repo = { createWallet: vi.fn() }
    })

    it("creates a user and wallet entry for each cognito user", async () => {
        fetchCognitoUsers([
            cognito_user('test_user_1', 'tester_1@test.com', 'test_1_sub'),
            cognito_user('test_user_2', 'tester_2@test.com', 'test_2_sub'),
        ])

        await initDB(user_repo, wallet_repo);

        expect(user_repo.createUser).toHaveBeenCalledWith('test_user_1', 'tester_1@test.com', 'test_1_sub', 'Mercury');
        expect(user_repo.createUser).toHaveBeenCalledWith('test_user_2', 'tester_2@test.com', 'test_2_sub', 'Mercury');

        expect(wallet_repo.createWallet).toHaveBeenCalledWith('id-test_user_1');
        expect(wallet_repo.createWallet).toHaveBeenCalledWith('id-test_user_2');
    });

    it("skips users without email or cognito id (sub)", async () => {
        fetchCognitoUsers([
            cognito_user('test-no-email', undefined, 'test_1_sub'),
            cognito_user('test-no-sub', 'tester_2@test.com'),
            cognito_user('test_user_3', 'tester_3@test.com', 'test_3_sub'),
        ]);

        await initDB(user_repo, wallet_repo);

        expect(user_repo.createUser).toHaveBeenCalledTimes(1);
        expect(user_repo.createUser).toHaveBeenCalledWith('test_user_3', 'tester_3@test.com', 'test_3_sub', 'Mercury');
    });

    it("Doesn't create wallets for existing users", async () => {
        user_repo.createUser.mockResolvedValue(null);
        fetchCognitoUsers([
            cognito_user('test_user_1', 'tester_1@test.com', 'test_1_sub')
        ]);

        await initDB(user_repo, wallet_repo);

        expect(wallet_repo.createWallet).not.toHaveBeenCalled();
    });

    it("Doesn't throw if cognito fails", async () => {
        vi.mocked(fetchAllCognitoUsers).mockRejectedValue(new Error('rate limited'));

        await expect(initDB(user_repo,wallet_repo)).resolves.toBeUndefined();
        expect(user_repo.createUser).not.toHaveBeenCalled();
    })
})

