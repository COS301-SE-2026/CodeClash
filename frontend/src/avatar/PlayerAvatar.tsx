//wrapper arounf AvatarRenderer to be drooped where the avatar should be/show

import React from "react";
import AvatarRenderer from './AvatarRenderer'

interface PlayerAvatarProps {
    avatarImageUrl?: string;
    size?: number;
    className?: string;
}

export const PlayerAvatar: React.FC<PlayerAvatarProps> = ({avatarImageUrl,size = 120, className}) => (
    <AvatarRenderer avatarImageUrl={avatarImageUrl} className={className} style={{width: size, height:size}}/>
)

export default PlayerAvatar;