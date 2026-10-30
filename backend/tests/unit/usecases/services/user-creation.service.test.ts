import { vi, describe, beforeEach, it, expect } from 'vitest'
import { CreateUser } from '../../../../src/application/usecases/services/user-creation.service'
import { fetchCognitoId } from '../../../../src/application/usecases/services/cognito.service';
import { HttpError } from "../../../../src/entities/errors/http-error";

vi.mock('../../../../src/application/usecases/services/cognito.service');

const cognito_user = (sub = 'sub-1') => ({ Attributes: [{ Name: 'sub', Value: sub }] });

let user_repo: any, equipped_repo: any, shop_item_repo: any, wallet_repo: any, inventory_repo: any;
let service: CreateUser

describe("Testing Create User", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        user_repo = { createUser: vi.fn(async () => ({ user_id: 'user-1' })) };
        equipped_repo = { updateEquipped: vi.fn() };
        shop_item_repo = {
            getDefaultTheme: vi.fn(async () => ({ shop_item_id: 'theme-1' })),
            getDefaultAvatar: vi.fn(async () => ({ shop_item_id: 'avatar-1' }))
        };
        wallet_repo = { createWallet: vi.fn() };
        inventory_repo = { grantItem: vi.fn() };
        service = new CreateUser(user_repo, equipped_repo, shop_item_repo, wallet_repo, inventory_repo);
    })

    it.each([
        ['no result', undefined],
        ['no matching user', []],
        ['more than one matching user', [cognito_user(), cognito_user('sub-2')]],
    ])("Throws an error when cognito return %s", async (_label, result) => {
        vi.mocked(fetchCognitoId).mockResolvedValue(result as any);

        await expect(service.create('test1', 'test1@test.com')).rejects.toThrow(HttpError);
        expect(user_repo.createUser).not.toHaveBeenCalled();
    })

    it("Throws when a user can't be created", async () => {
        vi.mocked(fetchCognitoId).mockResolvedValue([cognito_user()] as any);
        user_repo.createUser.mockResolvedValue(null);

        await expect(service.create('test1', 'test1@test.com')).rejects.toThrow('Error creating user');
        expect(wallet_repo.createWallet).not.toHaveBeenCalled();
        expect(inventory_repo.grantItem).not.toHaveBeenCalled();
    })

    it("Creates a uaser with a wallet and default itmes", async () => {
        vi.mocked(fetchCognitoId).mockResolvedValue([cognito_user('sub-9')] as any);

        await service.create('test1', 'test1@test.com');

        expect(user_repo.createUser).toHaveBeenCalledWith('test1', 'test1@test.com', 'sub-9', 'Mercury');
        expect(wallet_repo.createWallet).toHaveBeenCalledWith('user-1');
        expect(equipped_repo.updateEquipped).toHaveBeenCalledWith('user-1', { theme_id: 'theme-1', avatar_item_id: 'avatar-1' });
        expect(inventory_repo.grantItem).toHaveBeenCalledWith('user-1', 'theme-1');
        expect(inventory_repo.grantItem).toHaveBeenCalledWith('user-1', 'avatar-1');
    })
})