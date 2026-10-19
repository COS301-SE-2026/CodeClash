import { useState } from "react";
import { POWER_EFFECTS, getTarget, type Owner } from "@/components/ui/animations/PowerEffect";

export const usePowerEffect = (myName: string, opponentName: string) => {
    const [effect, setEffect] = useState<string | null>(null);
    const [trigger, setTrigger] = useState(0);
    const [username, setUsername] = useState('');
    const [owner, setOwner] = useState<Owner>('me');
    const [shields, setShields] = useState({me: false, opponent: false});

    const fire = (eff: string, usedByMe = true) => {
        setEffect(eff);
        setUsername(getTarget(eff, usedByMe, myName, opponentName));
        setOwner(usedByMe ? 'me' : 'opponent');
        setTrigger((t) => t + 1);
    }

    const onSettled = (eff: string, who: Owner) => {
        if (POWER_EFFECTS[eff]?.persistent) setShields((S) => ({...S, [who]: true}));
    }

    const consumeShield = (who: Owner) => setShields((s) => ({...s, [who]: false}));

    return {
        fire,
        consumeShield,
        shields,
        effectProps: {effect, trigger, username, owner, onSettled}
    }
}