import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, Unique } from "typeorm";
import { Users } from "./user.entities";
import { ShopItem } from "./shop-item.entities";

@Entity('user_items')
@Unique(['user', 'shop_item'])
export class UserItem {
    @PrimaryGeneratedColumn('uuid')
    user_item_id!: string;

    @ManyToOne(() => Users)
    @JoinColumn({ name: 'user_id' })
    user!: Users;

    @ManyToOne(() => ShopItem)
    @JoinColumn({ name: 'shop_item_id' })
    shop_item!: ShopItem;

    @CreateDateColumn()
    acquired_at!: Date
}