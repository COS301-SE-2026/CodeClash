import { ShopItem } from '../../src/entities/database/shop-item.entities';

export const mock_shop_items: Partial<ShopItem>[] = [
    {
        category: 'powerup',
        name: 'Test Shield',
        description: 'Blocks the next power-down used against you this match.',
        price: 100,
        rarity: 'epic',
        metadata: { effect: 'block_next_powerdown', consumed_on_use: true }
    },
    {
        category: 'avatar',
        name: 'Test Avatar',
        description: 'A test avatar.',
        price: 50,
        rarity: 'common',
        metadata: { asset_key: 'test-avatar-1' }
    },
    {
        category: 'theme',
        name: 'Default',
        description: 'The default theme.',
        price: 0,
        rarity: 'common',
        metadata: { hex_color_1: '#c0395a', hex_color_2: '#530a23', hex_color_3: '#fcecdd', is_default: true }
    },
    {
        category: 'theme',
        name: 'Test Nebula',
        description: 'A test theme.',
        price: 200,
        rarity: 'rare',
        metadata: {hex_color_1: '#8b3fd6', hex_color_2: '#4a1d80', hex_color_3: '#f0e5fc'}
    }
];