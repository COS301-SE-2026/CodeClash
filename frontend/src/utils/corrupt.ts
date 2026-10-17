const JUNK = [ '#', '@@', '}{', '??','~', '\\', '$$'];

export function corruptCode(src: string): string {
    const lines = src.split('\n');
    for (let i = 0; i < Math.max(1, Math.ceil(lines.length / 3)); i++) {
        const l = Math.floor(Math.random() * lines.length);
        const at = Math.floor(Math.random() * (lines[l]!.length + 1));
        lines[l] = lines[l]!.slice(0, at) + JUNK[Math.floor(Math.random() * JUNK.length)] + lines[l]!.slice(at);
    }
    return lines.join('\n');
}

export const corruptMath = (s: string) => s.replace(/\+/g, '\\div ').replace(/-/g, '\\times ') + (Math.random() < 0.5 ? '7' : '0');