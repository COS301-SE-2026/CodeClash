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
    })
}