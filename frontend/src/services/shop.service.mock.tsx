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

const MOCKED_WALLET: Wallet = {stardust: 1000};

const MOCKED_INV: UserInventory = {
    owned: [
        {
            itemId: 'robot-alien',
            category: 'avatar',
            acquiredAt: new Date().toISOString()
        },
        {
            itemId: 'theme-frost',
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
    equippedAvatarId: 'robot-alient',
    equippedAccessories: {
        headwear: 'acc-cap-01'
    },
    equippedThemeId: 'theme-frost',
    savedAvatarConf: []
}

//lets simulate some real net latency to see loading states :)
const delay = <T,>(value: T) => new Promise<T>((resolve) => setTimeout(() => resolve(value), 400));
export const getCatalog = () => delay(MOCKED);
export const getWallet = () => delay(MOCKED_WALLET);
export const getInv = () => delay(MOCKED_INV);

export const purchaseItm = async (itemId: string) => {
    const item = MOCKED.find((i) => i.id === itemId);
    if (!item) {
        throw new Error('Item not found');
    }

    MOCKED_WALLET.stardust -= item.price.amount;
    MOCKED_INV.owned.push(
        {
            itemId,
            category: item?.category as any,
            acquiredAt: new Date().toISOString()
        }
    )
    return delay({wallet: {...MOCKED_WALLET}, inventory: {...MOCKED_INV}});
}

export const equipItm = async (category: 'avatar' | 'theme', itemId: string) => {
    if (category === 'avatar') MOCKED_INV.equippedAvatarId = itemId;
    if (category === 'theme') MOCKED_INV.equippedThemeId = itemId;
    return delay({...MOCKED_INV});
}

export const equipAcc = async (slot: string, itemId: string | null) => {
    if (itemId) MOCKED_INV.equippedAccessories[slot as keyof typeof MOCKED_INV.equippedAccessories] = itemId;
    else delete MOCKED_INV.equippedAccessories[slot as keyof typeof MOCKED_INV.equippedAccessories];
    return delay({...MOCKED_INV});
}

export const createSavedAvatar = async (conf: Omit<UserInventory['savedAvatarConf'][number], 'id' | 'createdAt'>) => {
    const created = {...conf, id: 'saved-' + Date.now(), createdAt: new Date().toISOString()};
    MOCKED_INV.savedAvatarConf.push(created);
    return delay(created)
}

export const deleteSavedAvatar = async (id:string) =>{
    MOCKED_INV.savedAvatarConf = MOCKED_INV.savedAvatarConf.filter((c) => c.id !== id);
    return delay(undefined);
}