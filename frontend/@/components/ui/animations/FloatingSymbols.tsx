import { useMemo } from "react";
import { secureRandom } from "./Starfield";

const modules = import.meta.glob("src/assets/Decor/Symbols/*.png", {
    eager: true,
    import: 'default'
}) as Record<string, string>;

const SYMBOLS = Object.values(modules);

type FloatingSymbolsProps = {
    count?: number;
}

const FloatingSymbols = ({count = 24}: FloatingSymbolsProps) => {
    const items = useMemo(
        () => SYMBOLS.length === 0 ? [] : Array.from({length: count}, (_, i) => ({
            id: i,
            src: SYMBOLS[Math.floor(secureRandom() * SYMBOLS.length)],
            left: secureRandom() * 100,
            size: 1.5 + secureRandom() * 2.5,
            duration: 18 + secureRandom() * 22,
            delay: -secureRandom() * 40,
            drift: (secureRandom() - 0.5) * 200,
            rotate: (secureRandom() - 0.5) * 200,
            opacity: 0.05 + secureRandom() * 0.10
        })),
        [count]
    )
}