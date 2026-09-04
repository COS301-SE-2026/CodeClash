import {useState, useEffect} from 'react';
import { useSocket } from './useSocket';


export function useMatchAvatars({pair_id, myUserId, myPose, myColour}) {
    const [opponent, setOpponent] = useState(null);
    const socket = useSocket();

    useEffect(() => {
        if (!pair_id){
            return;
        }

        socket.emit('match_join', {pair_id, pose: myPose, colour: myColour});

        const handleOpponentAvatar = ({user_id, pose, colour}) => {
            if( user_id === myUserId){
                return;
            }
            setOpponent({ user_id, pose, colour });
        };

        socket.on('share_avatar', handleOpponentAvatar);

        return () => {
            socket.off('share_avatar', handleOpponentAvatar);
        };
    }, [pair_id, myUserId, myPose, myColour]);

    return {opponent};
}