import { Ban, Bug, Clock, Eraser, EyeOff, Heart, HeartCrack, Lightbulb, Shield, ShieldAlert, TrendingUp, Wind, Zap } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useInventory } from "src/context/Shop/InventoryContext";
import type { PowerupShopItem, PowerupEffectType } from "src/Models/ShopModel";

const Icons: Record<PowerupEffectType, React.ComponentType<{size?: number; className?: string}>> = {
    reduce_time: Clock,
    reveal_hint: Lightbulb,
    block_next_powerdown: ShieldAlert,
    score_multiplier: Zap,
    restore_life: Heart,
    insert_bugs: Bug,
    wipe_answer: Eraser,
    block_question: Ban,
    increase_time: Clock,
    drain_life: HeartCrack,
}

interface PowerupProps {
    isOpen: boolean;
    onClose: () => void;
    maxSlots?: number;
    onConfirm?: (itemIds: string[]) => void;
}

export const PowerupPopup: React.FC<PowerupProps> = ({isOpen, onClose, maxSlots = 3, onConfirm}) => {
    const {catalog, inventory} = useInventory();
    const [load, setLoad] = useState<string[]>([]);

    useEffect(() => {
        if (isOpen) {
            setLoad([]);
        }
    }, [isOpen])

    if (!isOpen) {
        return null;
    }

    const owned = (inventory?.consumable ?? []).map((c) => ({item: catalog.find((i): i is PowerupShopItem => i.category === 'powerup'
    && i.id === c.itemId), quantity: c.quantity})).filter((row): row is {item: PowerupShopItem; quantity: number} => !!row.item);

    const toggle = (itemId: string) => {
        setLoad((prev) => {
            if (prev.includes(itemId)) {
                return prev.filter((id) => id !== itemId);
            }
            if (prev.length >= maxSlots) {
                return prev;
            }
            return [...prev, itemId];
        })
    }

    const handleConfirm = () => {
        onConfirm?.(load);
        onClose();
    }
}

export default PowerupPopup;