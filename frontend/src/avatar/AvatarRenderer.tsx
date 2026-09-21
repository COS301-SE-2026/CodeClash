//Renders the avatar with the accessories in the correct draw order

import React from "react";
import type { AccessorySlot } from "src/Models/ShopModel";

const Anchors: Record<AccessorySlot, { //these are roughly based on Vexa, it needs proper tuning for ALL characters
    x: number;
    y:number;
    w: number;
    h: number;
}> = {
    headwear: {
        x: 92, 
        y: 4,
        w: 56,
        h: 40
    },
    neckwear: {
        x: 92, 
        y: 74,
        w: 56,
        h: 28
    },
    belt: {
        x: 78, 
        y: 150,
        w: 84,
        h: 22
    },
    facewear: {
        x: 96, 
        y: 30,
        w: 48,
        h: 22
    },
    cape: {
        x: 40, 
        y: 70,
        w: 160,
        h: 120
    }
}

const behind: AccessorySlot[] = ['cape']; //cape will need to attach to back and just kinda creep out of the front
const infront: AccessorySlot[] = ['headwear', 'neckwear', 'facewear', 'belt'];

interface AvatarRendererProps {
    avatarImageUrl?: string;
    accessories?: Partial<Record<AccessorySlot, string>>;
    className?: string;
    style?: React.CSSProperties;
}

export const AvatarRenderer: React.FC<AvatarRendererProps> = ({
    avatarImageUrl, 
    accessories = {},
    className,
    style,
}) => {
    const overlay = (slot: AccessorySlot) => {
        const url = accessories[slot];
        if (!url) {
            return null;
        }
        const anch = Anchors[slot];
        return <image key={slot} href={url} x={anch.x} y={anch.y} width={anch.w} height={anch.h}/>
    }

    return (
        <svg viewBox="0 0 240 340" className={className} style={style}>
            {behind.map(overlay)}
            {avatarImageUrl && <image href={avatarImageUrl} x={0} y={0} width={240} height={340}/>}
            {infront.map(overlay)}
        </svg>
    )
}

export default AvatarRenderer;