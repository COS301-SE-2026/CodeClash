import { Ban, Bug, Clock, Eraser, Heart, HeartCrack, Lightbulb, ShieldAlert, X, Zap } from "lucide-react";
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

    const tintText = (kind: PowerupShopItem['kind']) => kind === 'powerdown' ? 'text-danger' : 'text-primary';
    const tintBorder = (kind: PowerupShopItem['kind']) => kind === 'powerdown' ? 'border-danger' : 'border-primary';
    const tintGlow = (kind: PowerupShopItem['kind']) => kind === 'powerdown' ? 'shadow-[0_0_16px_var(--danger)]' : 'shadow-[0_0_16px_var(--primary)]';

    return (
        <div className="fixed inset-0 z-50 items-center justify-center p-4 bg-black/60" onClick={onClose}>
            <div className="card-elevated w-full max-w-[640px] max-h-[85vh] overflow-y-auto flex flex-col gap-5 p-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between">
                    <h2 className="section-title text-md">Your Power-Ups</h2>
                    <button type="button" onClick={onClose} className="btn btn-ghost btn-icon" aria-label="Close">
                        <X size={18}/>
                    </button>
                </div>

                {owned.length === 0 ? (
                    <div className="empty-state py-6">
                        <p className="text-muted text-sm">You don't have any powerups - purchase some from the Shop</p>
                    </div>
                ) : (
                    <div className="grid gap-3 grid-cols-[repeat(auto-fill, minmax(84px, 1fr))]">
                        
                    </div>
                )}
            </div>
        </div>
    )
}

export default PowerupPopup;