import { Bug, Clock, Eraser, EyeOff, HeartCrack, Lightbulb, Shield, TrendingUp, Wind } from "lucide-react";
import React from "react";
import { useInventory } from "src/context/Shop/InventoryContext";
import type { PowerupShopItem, PowerupEffectType } from "src/Models/ShopModel";

const Icons: Record<PowerupEffectType, React.ComponentType<{size?: number}>> = {
    hint: Lightbulb,
    shield: Shield,
    scoreBoost: TrendingUp,
    secondWind: Wind,
    timeUp: Clock,
    timeDown: Clock,
    bug: Bug,
    wipe: Eraser,
    questionVisibility: EyeOff,
    lifeDrain: HeartCrack
}

interface PowerupProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm?: (itemIds: string[]) => void;
}