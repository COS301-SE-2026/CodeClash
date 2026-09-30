//wrapper arounf AvatarRenderer to be drooped where the avatar should be/show

import React from "react";
import AvatarRenderer from './AvatarRenderer'
import {resolve} from '../assets/Shop/ResolveShopImages';

interface PlayerAvatarProps {
    assetKey?: string;
    size?: number;
    className?: string;
}

export const PlayerAvatar: React.FC<PlayerAvatarProps> = ({assetKey,size = 120, className}) => (
    <AvatarRenderer avatarImageUrl={resolve(assetKey)} className={className} style={{width: size, height:size}}/>
)

export default PlayerAvatar;