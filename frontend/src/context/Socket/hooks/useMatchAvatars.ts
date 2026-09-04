import {useState, useEffect} from 'react';
import { useSocket } from './useSocket';


export function useMatchAvatars({pair_id, myPlayerId, myPose, myColour}) {
    const [opponent, setOpponent] = useState(null);
    const socket = useSocket();

    useEffect(() => {
        if (!pair_id){
            return;
        }

        socket.emit('match_join', {pair_id, pose: myPose, colour: myColour});
<<<<<<< HEAD

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
=======
    })
>>>>>>> parent of ac5caae5 (realised current set up for sockets and handlers/providers would not work for seeing opponent's avatar in a match as is - creating new hook for the match page, continued, allowed opponent to be accounted for so its avatar can be found)
}