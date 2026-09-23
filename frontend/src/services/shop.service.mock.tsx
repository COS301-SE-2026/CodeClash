//mock file to be replaced by actual shop.service.ts and import in InventoryContext aslo changed

import type { ShopItem, AvatarShopItem, AccessoryShopItem, ThemeShopItem, PowerupShopItem, Wallet, UserInventory, AccessorySlot, Owned } from "src/Models/ShopModel";
import {resolve} from "../assets/Shop/ResolveShopImages";
import { T } from "node_modules/vitest/dist/chunks/traces.d.D2T_R8rx";

//names and descriptions copied from pre made shop details word document that I handed to backend

const MOCKED_AVATARS: AvatarShopItem[] = [
    {
        id: 'vexa',
        category: 'avatar',
        name: 'Vexa',
        description: 'She appeared through a mysterious portal beyond the edge of mapped space. Her technology is unlike anything in the galaxy and she seems strangely familiar with',
        price: {amount: 0},
        rarity: 'common',
        bodyType: 'slim',
        isDefault: true,
        previewImageUrl: resolve('Vexa')
    },
    {
        id: 'zen',
        category: 'avatar',
        name: 'Zen',
        description: 'Zen was created to protect the last surviving archive of human knowledge. Centuries of standing watch gave her an unusual philosophy: every problem has a solution, but sometimes the solution is simply waiting long enough to see it. ',
        price: {amount: 300},
        rarity: 'common',
        bodyType: 'slim',
        isDefault: false,
        previewImageUrl: resolve('Zen')
    },
    {
        id: 'axiom',
        category: 'avatar',
        name: 'Axiom',
        description: "Axiom was manufactured as an ordinary service android with no special abilities. But unlike the others, Axiom learned entirely on his own. He entered the competition with one goal: to prove that intelligence doesn't have to be built, it can be learned.",
        price: {amount: 300},
        rarity: 'rare',
        bodyType: 'slim',
        isDefault: false,
        previewImageUrl: resolve('Axiom')
    },
    {
        id: 'kairo',
        category: 'avatar',
        name: 'Kairo',
        description: "Kairo was a discarded prototype found wandering through an abandoned megacity. He rebuilt himself piece by piece from whatever technology he could find. He's now obsessed with proving that a discarded machine can become the greatest competitor in the galaxy. ",
        price: {amount: 350},
        rarity: 'common',
        bodyType: 'slim',
        isDefault: false,
        previewImageUrl: resolve('Kairo')
    },
    {
        id: 'brix',
        category: 'avatar',
        name: 'Brix',
        description: "Brix was originally a construction unit designed to build colonies on hostile planets. After completing his final assignment, he refused deactivation. Now he competes simply because, according to his own calculations, “winning is more fun than being recycled.” ",
        price: {amount: 350},
        rarity: 'epic',
        bodyType: 'bulky',
        isDefault: false,
        previewImageUrl: resolve('Brix')
    },
]

const MOCKED_HEADWEAR: AccessoryShopItem[] = [
    {
        id: 'abyssal-crown',
        category: 'accessory',
        slot: 'headwear',
        name: 'Abyssal Crown',
        price: {amount: 250},
        rarity: 'common',
        previewImageUrl: resolve('abyssal-crown')
    },
    {
        id: 'lumi-ears',
        category: 'accessory',
        slot: 'headwear',
        name: 'Lumi Ears',
        price: {amount: 100},
        rarity: 'common',
        previewImageUrl: resolve('lumi-ears')
    },
    {
        id: 'void-caster',
        category: 'accessory',
        slot: 'headwear',
        name: 'Void Caster',
        price: {amount: 300},
        rarity: 'common',
        previewImageUrl: resolve('void-caster')
    },
]

const MOCKED_NECKWEAR: AccessoryShopItem[] = [
    {
        id: 'signal-scarf',
        category: 'accessory',
        slot: 'neckwear',
        name: 'Signal Scarf',
        price: {amount: 150},
        rarity: 'common',
        previewImageUrl: resolve('signal-scarf')
    },
    {
        id: 'crimson-scarf',
        category: 'accessory',
        slot: 'neckwear',
        name: 'Crimson Scarf',
        price: {amount: 200},
        rarity: 'common',
        previewImageUrl: resolve('crimson-scarf')
    },
    {
        id: 'azure-scarf',
        category: 'accessory',
        slot: 'neckwear',
        name: 'Azure Scarf',
        price: {amount: 250},
        rarity: 'common',
        previewImageUrl: resolve('azure-scarf')
    },
]

const MOCKED_FACEWEAR: AccessoryShopItem[] = [
    {
        id: 'pink-visor',
        category: 'accessory',
        slot: 'facewear',
        name: 'Pink Visor',
        price: {amount: 150},
        rarity: 'common',
        previewImageUrl: resolve('pink-visor')
    },
    {
        id: 'blue-visor',
        category: 'accessory',
        slot: 'facewear',
        name: 'Blue Visor',
        price: {amount: 150},
        rarity: 'common',
        previewImageUrl: resolve('blue-visor')
    },
    {
        id: 'void-frames',
        category: 'accessory',
        slot: 'facewear',
        name: 'Void Frames',
        price: {amount: 250},
        rarity: 'common',
        previewImageUrl: resolve('void-frames')
    },
]

const MOCKED_BELTS: AccessoryShopItem[] = [
    {
        id: 'guardian-belt',
        category: 'accessory',
        slot: 'belt',
        name: 'Guardian Belt',
        price: {amount: 150},
        rarity: 'common',
        previewImageUrl: resolve('guardian-belt')
    },
    {
        id: 'runner-belt',
        category: 'accessory',
        slot: 'belt',
        name: 'Runner Belt',
        price: {amount: 200},
        rarity: 'common',
        previewImageUrl: resolve('runner-belt')
    },
    {
        id: 'x-harness',
        category: 'accessory',
        slot: 'belt',
        name: 'X Harness',
        price: {amount: 250},
        rarity: 'common',
        previewImageUrl: resolve('x-harness')
    },
]

const MOCKED_CAPES: AccessoryShopItem[] = [
    {
        id: 'pink-comet',
        category: 'accessory',
        slot: 'cape',
        name: 'Pink Comet',
        price: {amount: 150},
        rarity: 'common',
        previewImageUrl: resolve('pink-comet')
    },
    {
        id: 'starlance',
        category: 'accessory',
        slot: 'cape',
        name: 'Starlance',
        price: {amount: 150},
        rarity: 'common',
        previewImageUrl: resolve('starlance')
    },
    {
        id: 'void-mantle',
        category: 'accessory',
        slot: 'cape',
        name: 'Void Mantle',
        price: {amount: 200},
        rarity: 'common',
        previewImageUrl: resolve('void-mantle')
    },
]

const MOCKED_ACCESSORIES: AccessoryShopItem[] = [
    ...MOCKED_HEADWEAR, ...MOCKED_NECKWEAR, ...MOCKED_FACEWEAR, ...MOCKED_BELTS, ...MOCKED_CAPES
]

const MOCKED_THEMES: ThemeShopItem[] = [
    {
        id: 'theme-dark',
        category: 'theme',
        themeId: 'dark',
        name: 'Cosmos (Dark)',
        price: {amount: 0},
        isDefault: true,
        swatchColors: [ '#c0395a', '#530a23', '#fcecdd']
    },
    {
        id: 'theme-light',
        category: 'theme',
        themeId: 'light',
        name: 'Cosmos (Light)',
        price: {amount: 150},
        swatchColors: [ '#c0395a', '#530a23', '#fcecdd']
    },
    {
        id: 'theme-nebula',
        category: 'theme',
        themeId: 'nebula',
        name: 'Nebula',
        price: {amount: 200},
        swatchColors: [ '#8b3fd6', '#4a1d80', '#f0e5fc']
    },
    {
        id: 'theme-frost',
        category: 'theme',
        themeId: 'frost',
        name: 'Frost',
        price: {amount: 200},
        swatchColors: [ '#2f8fe0', '#14487a', '#e2f2fd']
    },
    {
        id: 'theme-verdant',
        category: 'theme',
        themeId: 'verdant',
        name: 'Verdant',
        price: {amount: 250},
        swatchColors: [ '#9ccc3c', '#4d661d', '#f1f9e0']
    },
    {    
        id: 'theme-gold',
        category: 'theme',
        themeId: 'gold',
        name: 'Gold',
        price: {amount: 250},
        swatchColors: [ '#d4af37', '#6b5716', '#f7edcf']
    },
]

const MOCKED_POWERUPS: PowerupShopItem[] = [
    {
        id: 'pu-hint',
        category: 'powerup',
        kind: 'powerup',
        name: 'Hint',
        description: 'Reveals part of the solution',
        price: {amount: 200},
        quantityGranted: 1,
        effect: {effectType: 'hint', targeting: 'self'}
    },
    {
        id: 'pu-shield',
        category: 'powerup',
        kind: 'powerup',
        name: 'Shield',
        description: 'Blocks a power down',
        price: {amount: 200},
        quantityGranted: 1,
        effect: {effectType: 'shield', targeting: 'self'}
    },
    {
        id: 'pu-wipe',
        category: 'powerup',
        kind: 'powerdown',
        name: 'Wipe',
        description: 'Clears a portion of the opponents answer',
        price: {amount: 200},
        quantityGranted: 1,
        effect: {effectType: 'wipe', targeting: 'opponent'}
    },
]

const MOCKED_CATALOG: ShopItem[] = [
    ...MOCKED_AVATARS, ...MOCKED_ACCESSORIES, ...MOCKED_THEMES, ...MOCKED_POWERUPS
]

const MOCKED_WALLET: Wallet = {stardust: 1000};

let ownedPoweupIds: string[] = ['pu-hint', 'pu-wipe'];

const MOCKED_INV: UserInventory = {
    owned: [
        {
            itemId: 'vexa',
            category: 'avatar',
            acquiredAt: new Date().toISOString()
        },
        {
            itemId: 'theme-dark',
            category: 'theme',
            acquiredAt: new Date().toISOString()
        },
    ],
    consumable: [{category: 'powerup', quantity: ownedPoweupIds.length}],
    equippedAvatarId: 'vexa',
    equippedAccessories: {},
    equippedThemeId: 'dark'
}

//copied from deleted file

//lets simulate some real net latency to see loading states :)
const delay = <T,>(value: T) => new Promise<T>((resolve) => setTimeout(() => resolve(value), 400));
const clone = (): UserInventory => ({
    ...MOCKED_INV,
    owned: [...MOCKED_INV.owned],
    consumable: MOCKED_INV.consumable.map((c) => ({...c})),
    equippedAccessories: {...MOCKED_INV.equippedAccessories}
})

export const getCatalog = () => delay(MOCKED_CATALOG);
export const getWallet = () => delay(MOCKED_WALLET);
export const getInv = () => delay(MOCKED_INV);

export const purchaseItm = async ( itemId: string, _token: string) => {
    const item = MOCKED_CATALOG.find((i) => i.id === itemId);
    if (!item) {
        throw new Error('Item not found');
    }

    const alreadyOwned = item.category === 'powerup' ? ownedPoweupIds.includes(itemId) : MOCKED_INV.owned.some((o) => o.itemId === itemId);
    if (alreadyOwned) {
        throw new Error('Item already owned');
    }

    if(MOCKED_WALLET.stardust < item.price.amount) {
        throw new Error('Not enough Stardust');
    }

    MOCKED_WALLET.stardust -= item.price.amount;
    if(item.category === 'powerup') {
        ownedPoweupIds = [...ownedPoweupIds, itemId];
        MOCKED_INV.consumable = [{category: 'powerup', quantity: ownedPoweupIds.length}];
    }
    else {
        const owned: Owned = {
            itemId, category: item.category as 'avatar' | 'accessory' | 'theme', acquiredAt: new Date().toDateString()
        }
        MOCKED_INV.owned = [...MOCKED_INV.owned, owned];
    }
    return delay({wallet: {...MOCKED_WALLET}, inventory: clone});
}

export const equipItm = async (category: 'avatar' | 'theme', itemId: string, _token: string) => {
    if (category === 'avatar') MOCKED_INV.equippedAvatarId = itemId;
    if (category === 'theme') MOCKED_INV.equippedThemeId = itemId;
    return delay(clone);
}

export const equipAcc = async (slot: AccessorySlot, itemId: string | null, _token: string) => {
    if (itemId) MOCKED_INV.equippedAccessories[slot] = itemId;
    else delete MOCKED_INV.equippedAccessories[slot];
    return delay(clone);
}