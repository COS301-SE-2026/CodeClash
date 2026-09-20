import { useCallback, useState } from "react";
import type { SavedAvatarConf } from "src/Models/ShopModel";
import { createSavedAvatar, deleteSavedAvatar } from "src/services/shop.service.mock";
import { useInventory } from "src/context/Shop/InventoryContext";

export const SavedViewModelFunc = () => {
    const {inventory, refetch} = useInventory();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const savedAvatars = inventory?.savedAvatarConf ?? []

    const saveCurrentAvatar = useCallback(async(conf: Omit<SavedAvatarConf, 'id' | 'createdAt'>) => {
        setSaving(true);
        setError(null);
        try {
            await createSavedAvatar(conf);
            await refetch();
        }
        catch (e) {
            setError(e instanceof Error ? e.message : 'Could not save avatar');
        }
        finally {
            setSaving(false);
        }
    }, [refetch])

    const removeSavedAvatar = useCallback(async (id: string) => {
        try {
            await deleteSavedAvatar(id);
            await refetch();
        }
        catch (e) {
            setError(e instanceof Error ? e.message : 'Could not delete');
        }
    }, [refetch])

    return {
        savedAvatars,
        saving,
        error,
        saveCurrentAvatar,
        removeSavedAvatar
    }
}