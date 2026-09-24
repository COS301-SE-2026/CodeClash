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

    @ManyToOne(() => ShopItem, { nullable: true })
    @JoinColumn({ name: 'avatar_item_id' })
    avatar!: ShopItem | null;

    @ManyToOne(() => ShopItem, { nullable: true })
    @JoinColumn({ name: 'headwear_id' })
    headwear?: ShopItem | null;

    @ManyToOne(() => ShopItem, { nullable: true })
    @JoinColumn({ name: 'neckwear_id' })
    neckwear?: ShopItem | null;

    @ManyToOne(() => ShopItem, { nullable: true })
    @JoinColumn({ name: 'facewear_id' })
    facewear?: ShopItem | null;

    @ManyToOne(() => ShopItem, { nullable: true })
    @JoinColumn({ name: 'belt_id' })
    belt?: ShopItem | null;

    @ManyToOne(() => ShopItem, { nullable: true })
    @JoinColumn({ name: 'one_piece_id' })
    one_piece?: ShopItem | null;

    @ManyToOne(() => ShopItem, { nullable: true })
    @JoinColumn({ name: 'powerup_item_id' })
    powerup?: ShopItem | null;

    @ManyToOne(() => ShopItem, { nullable: true })
    @JoinColumn({ name: 'theme_item_id' })
    theme?: ShopItem | null;
    
    @UpdateDateColumn()
    updated_at!: Date;
}