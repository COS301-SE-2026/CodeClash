//Renders the avatar with the accessories in the correct draw order

import React from "react";

interface AvatarRendererProps {
    avatarImageUrl?: string;
    className?: string;
    style?: React.CSSProperties;
}

export const AvatarRenderer: React.FC<AvatarRendererProps> = ({avatarImageUrl, className, style}) => (
    <svg viewBox="0 0 240 340" className={className} style={style}>
        {avatarImageUrl && <image href={avatarImageUrl} x={0} y={0} width={240} height={340}/>}
    </svg>
)

export default AvatarRenderer;