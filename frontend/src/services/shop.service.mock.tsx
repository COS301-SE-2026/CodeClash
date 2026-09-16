//mocked to see pipline of shop, endpoints still need to be implemented

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