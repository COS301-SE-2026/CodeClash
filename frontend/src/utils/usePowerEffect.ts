import { useState } from "react";
import { POWER_EFFECTS, getTarget, type Owner } from "@/components/ui/animations/PowerEffect";
import { playSfx } from "./audio";

export const usePowerEffect = (myName: string, opponentName: string) => {
    const [effect, setEffect] = useState<string | null>(null);
    const [trigger, setTrigger] = useState(0);
    const [username, setUsername] = useState('');
    const [owner, setOwner] = useState<Owner>('me');
    const [shields, setShields] = useState({me: false, opponent: false});

    const fire = (eff: string, usedByMe = true) => {
        playSfx(POWER_EFFECTS[eff]?.kind === 'powerdown' ? 'powerdown' : 'powerup');
        setEffect(eff);
        setUsername(getTarget(eff, usedByMe, myName, opponentName));
        setOwner(usedByMe ? 'me' : 'opponent');
        setTrigger((t) => t + 1);
    }

    const onSettled = (eff: string, who: Owner) => {
        if (who === 'me' && POWER_EFFECTS[eff]?.persistent) setShields((S) => ({...S, me: true}));
    }

    const consumeShield = () => setShields((s) => ({...s, me: false }));

    return {
        fire,
        consumeShield,
        shields,
        effectProps: {effect, trigger, username, owner, onSettled}
    }
}