import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export type ShopItemCategory = 'avatar' | 'accessory' | 'powerup' | 'theme';
export type ShopItemRarity = 'common' | 'rare' | 'epic' | 'legendary';

@Entity('shop_items')
export class ShopItem {
    @PrimaryGeneratedColumn('uuid')
    shop_item_id!: string;

    @Column({ type: 'varchar', length: 20 })
    category!: ShopItemCategory;

    @Column({ length: 50 })
    name!: string;

    @Column({ length: 200, nullable: false })
    description?: string;

    @Column('integer')
    price!: number;

    @Column({ type: 'varchar', length: 20, default: 'common' })
    rarity!: ShopItemRarity;

    @Column({ type: 'jsonb', default: {} })
    metadata!: Record<string, unknown>;

    @Column({ type: 'timestamp', default: () => 'NOW()' })
    created_at!: Date;
}