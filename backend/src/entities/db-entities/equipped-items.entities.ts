import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, UpdateDateColumn, OneToOne } from "typeorm"; 
import { Users } from './user.entities';
import { ShopItem } from "./shop-item.entities";

@Entity('equipped_items')
export class EquippedItems {
    @PrimaryGeneratedColumn('uuid')
    equipped_id!: string;

    @OneToOne(() => Users)
    @JoinColumn({ name: 'user_id'})
    user!: Users;

    @ManyToOne(() => ShopItem, { nullable: false })
    @JoinColumn({ name: 'avatar_item_id' })
    avatar!: ShopItem | null;

    @ManyToOne(() => ShopItem, { nullable: true })
    @JoinColumn({ name: 'top_id' })
    top?: ShopItem | null;

    @ManyToOne(() => ShopItem, { nullable: true })
    @JoinColumn({ name: 'bottom_id' })
    bottom?: ShopItem | null;

    @ManyToOne(() => ShopItem, { nullable: true })
    @JoinColumn({ name: 'one_piece_id' })
    one_piece?: ShopItem | null;

    @ManyToOne(() => ShopItem, { nullable: true })
    @JoinColumn({ name: 'shoes_id' })
    shoes?: ShopItem | null;

    @ManyToOne(() => ShopItem, { nullable: true })
    @JoinColumn({ name: 'hat_id' })
    hat?: ShopItem | null;

    @ManyToOne(() => ShopItem, { nullable: true })
    @JoinColumn({ name: 'powerup_item_id' })
    powerup?: ShopItem | null;

    @UpdateDateColumn()
    updated_at!: Date;
}