//mocked to see pipline of shop, endpoints still need to be implemented
//mock file to see pipeline while backend is getting implemented

import type { ShopItem, Wallet, UserInventory } from "src/Models/ShopModel";

const MOCKED: ShopItem[] = [
    {
        id: 'robot-cat',
        category: 'avatar',
        name: 'Robot Cat',
        description: 'Cat Robot with a Tail',
        price: {amount: 450},
        previewImageUrl: ''
    },
    {
        id: 'robot-alien',
        category: 'avatar',
        name: 'Robot Alien',
        description: 'Alien Robot',
        price: {amount: 550},
        previewImageUrl: ''
    },

    {
        id: 'acc-cape-01',
        category: 'accessory',
        slot: 'cape',
        name: 'Cloak',
        description: '',
        price: {amount: 650},
        rarity: 'epic',
        previewImageUrl: ''
    },
    {
        id: 'acc-cap-01',
        category: 'accessory',
        slot: 'headwear',
        name: 'Cap',
        description: '',
        price: {amount: 550},
        rarity: 'epic',
        previewImageUrl: ''
    },

    {
        id: 'theme-frost',
        category: 'theme',
        themeId: 'frost',
        name: 'Frost',
        price: {amount: 250},
        swatchColors: [ '#2f8fe0', '#14487a', '#e2f2fd'],
        previewImageUrl: ''
    },

    {
        id: 'pu-hint',
        category: 'powerup',
        kind: 'powerup',
        name: 'Hint',
        description: 'Reveal part of Solution',
        price: {amount: 250},
        quantityGranted: 2,
        effect: {effectType: 'hint', targeting: 'self'}
    },    
]

const MOCKED_WALLET: Wallet = {stardust: 1000};

const MOCKED_INV: UserInventory = {
    owned: [
        {
            itemId: 'robot-android',
            category: 'avatar',
            acquiredAt: new Date().toISOString()
        },
        {
            itemId: 'theme-cosmos',
            category: 'theme',
            acquiredAt: new Date().toISOString()
        },
        {
            itemId: 'acc-cap-01',
            category: 'accessory',
            acquiredAt: new Date().toISOString()
        }
    ],
    consumable: [
        {
            category: 'powerup',
            quantity: 2
        }
    ],
    equippedAvatarId: 'robot-android',
    equippedAccessories: {
        headwear: 'acc-cap-01'
    },
    equippedThemeId: 'theme-cosmos',
    savedAvatarConf: []
}