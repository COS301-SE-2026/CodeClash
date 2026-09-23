//wrapper arounf AvatarRenderer to be drooped where the avatar should be/show

import React from "react";
import AvatarRenderer from './AvatarRenderer'
import type { BodyType } from "./AvatarRenderer";
import type { AccessorySlot } from "src/Models/ShopModel";

interface PlayerAvatarProps {
    avatarImageUrl?: string;
    accessories: Partial<Record<AccessorySlot, string>>;
    size?: number;
    className?: string;
    bodyType?: BodyType;
}

export const PlayerAvatar: React.FC<PlayerAvatarProps> = ({avatarImageUrl, accessories, size = 120, className, bodyType}) => (
    <AvatarRenderer avatarImageUrl={avatarImageUrl} accessories={accessories} className={className} style={{width: size, height:size}} bodyType={bodyType}/>
)

export default PlayerAvatar;