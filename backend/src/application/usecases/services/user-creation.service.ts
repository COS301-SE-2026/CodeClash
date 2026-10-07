import { fetchCognitoId } from "./cognito.service";
import { IUserRepository } from "src/application/interfaces/repositories/IUserRepository";
import { IEquippedRepository } from "src/application/interfaces/repositories/IEquippedRepository";
import { IShopItemRepository } from "src/application/interfaces/repositories/IShopItemRepository";
import { IWalletRepository } from "src/application/interfaces/repositories/IWalletRepository";
import { IInventoryRepository } from "src/application/interfaces/repositories/IInventoryRepository";
import { IInventoryRepository } from "src/application/interfaces/repositories/IInventoryRepository";


export class CreateUser {
    private avatar_index = 0;

    constructor(
        private readonly user_repo: IUserRepository,
        private readonly equipped_repo: IEquippedRepository,
        private readonly shop_item_repo: IShopItemRepository,
        private readonly wallet_repo: IWalletRepository,
        private readonly inventory_repo: IInventoryRepository
    ) { }

    async create(username: string, email: string) {
        const user_id = await fetchCognitoId(email);

        if (user_id == undefined || (user_id.length ?? 0) !== 1) {
            throw new Error("Invalid Paramaters");
        }

        const id = user_id[0]!.Attributes!.find(attr => attr.Name === "sub")?.Value;

        const user = await this.user_repo.createUser(username, email, id!, this.avatar_index, "Mercury");

        if (!user) {
            throw new Error("Error creating user");
        }


        this.avatar_index = ++this.avatar_index % 4;
        // setting default theme
        const default_theme = await this.shop_item_repo.getDefaultTheme();
        const default_avatar = await this.shop_item_repo.getDefaultAvatar();
        await this.wallet_repo.createWallet(user.user_id!);

        await this.equipped_repo.updateEquipped(user.user_id!, { theme_id: default_theme.shop_item_id, avatar_item_id: default_avatar.shop_item_id });
        await this.inventory_repo.grantItem(user.user_id!, default_theme.shop_item_id);
        await this.inventory_repo.grantItem(user.user_id!, default_avatar.shop_item_id);
    }
}