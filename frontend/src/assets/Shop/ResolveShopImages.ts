import { shop_map } from ".";

export function resolve(imageKey?: string): string | undefined {
    if (!imageKey) {
        return undefined;
    }

    console.log('[RESOLVE DEBUG] received imageKey:', JSON.stringify(imageKey));

    const resolved = shop_map[imageKey];
    if (!resolved) {
        console.warn(`[Shop] No bundled asset found for imageKey "${imageKey}"`)
    }

    return resolved;
}

export function resolveCatalog<TRaw extends {imageKey?: string}>(
    items: TRaw[]
) : (TRaw & {previewImageUrl?: string})[] {
    return items.map((item) => ({...item, previewImageUrl: resolve(item.imageKey)}));
}