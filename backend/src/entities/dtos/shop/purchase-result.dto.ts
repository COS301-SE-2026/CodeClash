import { WalletDTO } from "./wallet.dto";
import { UserItemDTO } from "./user-item.dto";

export interface PurchaseResultDTO {
    wallet: WalletDTO;
    item: UserItemDTO;
}