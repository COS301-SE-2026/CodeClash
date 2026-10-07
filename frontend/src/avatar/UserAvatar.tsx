import React from "react";
import { useUser } from "src/context/User/hooks/useUser";
import PlayerAvatar from "./PlayerAvatar";

interface UserAvatarProps {
    size?: number;
    className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({size, className}) => {
    const {avatar} = useUser();
    console.log("avatar", avatar)
    return <PlayerAvatar assetKey={avatar} size={size} className={className}/>
}

export default UserAvatar;