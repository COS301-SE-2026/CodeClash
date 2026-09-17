import { useCallback, useMemo, useState } from "react";
import type { ShopCategory, ShopItem } from "src/Models/ShopModel";
import { useInventory } from "src/context/Shop/InventoryContext";

export interface ShopTab {
    id: string;
    label: string;
    catgeories: ShopCategory[];
}

export const Tabs: ShopTab[] = [
    {
        id: 'avatars',
        label: 'Avatars',
        catgeories: ['avatar', 'accessory']
    },
    {
        id: 'themes',
        label: 'Themes',
        catgeories: ['theme']
    },
    {
        id: 'powerups',
        label: 'Power-Ups',
        catgeories: ['powerup']
    },
]

