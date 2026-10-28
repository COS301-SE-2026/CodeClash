import { Bug, Eraser, EyeOff, Heart, HeartCrack, Hourglass, ShieldAlert, Sparkles, Timer, X, Zap } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useInventory } from "src/context/Shop/InventoryContext";
import type { 
    PowerupShopItem, 
    PowerupEffectType } from "src/Models/ShopModel";

const Icons: Record<PowerupEffectType, React.ComponentType<{size?: number; className?: string}>> = {
    reduce_time: Timer,
    block_next_powerdown: ShieldAlert,
    score_multiplier: Zap,
    restore_life: Heart,
    insert_bugs: Bug,
    wipe_answer: Eraser,
    blackout_question: EyeOff,
    increase_time: Hourglass,
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

    const dialogRef = useRef<HTMLDialogElement>(null);
    const prevRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (isOpen) {
            setLoad([]);
        }
    }, [isOpen])

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        prevRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        const dialog = dialogRef.current;
        if (dialog && !dialog.open) {
            dialog.showModal();
        }
        const getEls = (): HTMLElement[] => {
            if (!dialog) {
                return [];
            }
            return Array.from(dialog.querySelectorAll<HTMLElement>('button:not(:disabled), [href], input:not(:disabled),'
                + 'select:not(:disabled), textarea:not(:disabled),' + '[tabindex]:not([tabindex="-1"])'
            )).filter(
                (element) => !element.hasAttribute("hidden") && element.getAttribute("aria-hidden") !== "true"
            )
        }

        const els = getEls();
        els[0]?.focus();
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                onClose();
                return;
            }
            if (event.key === "Tab") {
                const el = getEls();
                if (el.length === 0) {
                    event.preventDefault();
                    dialog?.focus();
                    return;
                }
                const first = el[0];
                const last = el[el.length - 1];

                if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
                    event.preventDefault();
                    last.focus();
                }
                else if ( !event.shiftKey && document.activeElement === last) {
                    event.preventDefault();
                    first.focus();
                }
            }
        }
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            if (dialog?.open) {
                dialog.close();
            }
            prevRef.current?.focus();
        }
    }, [isOpen, onClose])

    if (!isOpen) {
        return null;
    }

    const owned = (inventory?.consumable ?? []).map((c) => ({item: catalog.find((i): i is PowerupShopItem => i.category === 'powerup'
    && i.id === c.itemId), quantity: c.quantity})).filter((row): row is {item: PowerupShopItem; quantity: number} => !!row.item);

    const addToLoadout = (itemId: string) => {
        setLoad((prev) => {
            if (prev.length >= maxSlots) {
                return prev;
            }
            const item = owned.find((o) => o.item.id === itemId)?.item;

            if (item?.effect.effectType === "wipe_answer"){
                const alreadySelected = prev.some((id) => {
                    const selectedItem = owned.find((o) => o.item.id === id)?.item;
                    return selectedItem?.effect.effectType === "wipe_answer";
                }) 
                if (alreadySelected) {
                    return prev;
                }
            }
            return [...prev, itemId];
        })
    }

    const removeFromLoadout = (index: number) => {
        setLoad((prev) => prev.filter((_, i) => i !==index));
    }

    const handleConfirm = () => {
        onConfirm?.(load);
        onClose();
    }

    const tintText = (kind: PowerupShopItem['kind']) => kind === 'powerdown' ? 'text-danger' : 'text-success';
    const tintBorder = (kind: PowerupShopItem['kind']) => kind === 'powerdown' ? 'border-danger' : 'border-success';
    const tintGlow = (kind: PowerupShopItem['kind']) => kind === 'powerdown' ? 'shadow-[0_0_16px_var(--danger)]' : 'shadow-[0_0_16px_var(--success)]';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/60">
            <dialog className="card-elevated w-full max-w-[700px] max-h-[85vh] overflow-y-auto flex flex-col gap-5 p-6" ref={dialogRef} aria-labelledby="powerup-popup-title" tabIndex={-1}>
                <div className="flex items-center justify-between">
                    <h2 className="section-title text-md" id="powerup-popup-title">Your Power-Ups</h2>
                    <button type="button" onClick={onClose} className="btn btn-ghost btn-icon" aria-label="Close">
                        <X size={18}/>
                    </button>
                </div>

                {owned.length === 0 ? (
                    <div className="empty-state py-6">
                        <p className="text-muted text-sm">You don't have any powerups - purchase some from the Shop</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 justify-items-center">
                        {owned.map(({item, quantity}) => {
                            const Icon = Icons[item.effect.effectType];
                            const selected = load.includes(item.id);
                            const selectedPow = selected ? `border-2 ${tintBorder(item.kind)} ${tintGlow(item.kind)}` : '';
                            return (
                                <button key={item.id} type="button" onClick={() => addToLoadout(item.id)} className={['card-glass relative flex flex-col items-center justify-center gap-2 w-[120px] h-[120px] p-4 cursor-pointer transition-all duration-200', selectedPow, ].filter(Boolean).join(" ")}>
                                    <span className="badge absolute top-2 right-2 px-2 py-1 text-xs bg-card text-muted-text">{quantity}</span>
                                    <Icon size={26} className={tintText(item.kind)}/>
                                    <span className="text-primary-text text-center text-xs font-bold leading-tight">{item.name}</span>
                                </button>
                            )
                        })}
                    </div>
                )}

                <hr className="divider"/>
                <div className="flex flex-col items-center gap-3">
                    <h3 className="text-primary-text font-bold text-sm">Current Loadout</h3>
                    <div className="flex gap-3">
                        {Array.from({length: maxSlots}).map((_, i) => {
                            const itemId = load[i];
                            const item = itemId ? owned.find((o) => o.item.id === itemId)?.item : undefined;
                            const Icon = item ? Icons[item.effect.effectType] : Sparkles;
                            const slotPow = item ? `cursor-pointer border border-border bg-card` : 'cursor-default border border-dashed border-border';
                            const slowLabel = item ? `Remove ${item.name} from loadout slot ${i + 1}` : `Loadout slot ${i + 1}, empty`;
                            return (
                                <button key={`loadout-slot-${i+1}`} type="button" disabled={!item} onClick={() => removeFromLoadout(i)} className={`flex items-center justify-center w-16 h-16 rounded-md ${slotPow}`} aria-label={slowLabel}>
                                    <Icon size={24} className={item ? tintText(item.kind) : 'text-muted-text'}/>
                                </button>
                            )
                        })}
                    </div>
                    <p className="text-muted-text text-xs">{load.length >= maxSlots ? 'Loadout full - tap a slot to free it' : 'Select a power-up to add it to your loadout'}</p>
                </div>
                <button type="button" onClick={handleConfirm} className="btn btn-primary w-[50%] mx-auto">Confirm</button>
            </dialog>
        </div>
    )
}

export default PowerupPopup;