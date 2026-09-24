import { EquippedItemsDTO, UpdatedEquippedDTO } from "src/entities/dtos/shop/equipped-items.dto";

export interface IEquippedRepository {
    getEquipped(user_id: string): Promise<EquippedItemsDTO | null>;
    updateEquipped(user_id: string, updates: UpdatedEquippedDTO): Promise<EquippedItemsDTO>;

}