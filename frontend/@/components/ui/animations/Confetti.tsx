import { useMemo } from "react";

import { secureRandom } from "./Starfield";

type ConfettiProps = {
    count?: number;
}

const Colors = [
    "var(--color-pink-100)",
    "var(--color-pink-200)",
    "var(--primary)",
    "#ffffff"
];

const Confetti = ({count = 30}: ConfettiProps) => {
    const particles = useMemo(
        () =>
            Array.from({length: count}, (_, i) => ({
                id: i, left: secureRandom() * 6, size: 4 + secureRandom() *6,
                delay: secureRandom() * 3, duration: 2.5 + secureRandom() * 2, color: Colors[Math.floor(secureRandom() * Colors.length)]
            })), [count]
    );

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((p) => (
                <span key={p.id} className="confetti-particle"
                    style={{left: `${p.left}%`, bottom: '-20px', width: p.size, height: p.size, background: p.color, animationDelay: `${p.delay}s`, animationDuration: `${p.duration}s`}}
                />
            ))}
        </div>
    )
}

export default Confetti;