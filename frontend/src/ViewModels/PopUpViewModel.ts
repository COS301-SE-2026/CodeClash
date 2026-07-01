import { useEffect, useState } from "react";
import axios from 'axios'
import { fetchAuthSession } from "aws-amplify/auth";
import { useNavigate } from "react-router-dom";


const getUserToken = async () => {
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken;

    return idToken || null;
}

export function useSelectTopic() {
    const navigation = useNavigate();

    console.log('useSelectTopic');

    const token = getUserToken.toString();

    if (token == null) {
        // handle error
    }

    const [topic, setTopic] = useState('');
    const [elo, setElo] = useState(0);


    useEffect(() => {

        try {
            console.log('sending axios')

            // axios.get('http://localhost:3000/elo', {
            //     headers: { Authorization: `Bearer ${token}` }
            // })
            //     .then((res) => {
            //         if (res.status === 200)
            //             setElo(res.data.elo)
            //         else {
            //             console.log(`Error: ${res.status}`)
            //             console.log(`${res.data}`);
            //         }
            //     })

            console.log('after axios')
        }
        catch {
            console.log('Error sending request')
        }
    }, [])

    const selectTopic = (selected_topic: string, socket: WebSocket | null) => {
        setTopic(selected_topic);

        const data = JSON.stringify({
            type: 'ENQUEUE',
            game_mode: topic,
            id: token,
            elo: elo
        })

        try {
            // send request to add user to matchmaking queue
            // socket?.send(data);
            console.log("SENDING DATA THROUGH SOCKET");
        }
        catch {

        }

        // navigation('/searching');
    }
    return selectTopic;
}