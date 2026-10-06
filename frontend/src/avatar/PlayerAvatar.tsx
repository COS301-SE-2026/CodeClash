//wrapper arounf AvatarRenderer to be drooped where the avatar should be/show

import React from "react";
import AvatarRenderer from './AvatarRenderer'
import {resolve} from '../assets/Shop/ResolveShopImages';

interface PlayerAvatarProps {
    assetKey?: string;
    size?: number;
    className?: string;
    viewBox?: string;
    preserveAspectRatio?: string;
}

export const PlayerAvatar: React.FC<PlayerAvatarProps> = ({assetKey, size = 120, className, viewBox, preserveAspectRatio}) => (
    <AvatarRenderer avatarImageUrl={resolve(assetKey)} className={className} viewBox={viewBox} preserveAspectRatio={preserveAspectRatio} style={size ? {width: size, height:size} : undefined}/>
)

export default PlayerAvatar;