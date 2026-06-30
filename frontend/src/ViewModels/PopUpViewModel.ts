import { useEffect, useState } from "react";
import axios from 'axios'
import { type authPayload } from '../Models/PopUpModel'
import { CognitoJwtVerifier } from 'aws-jwt-verify'
import { fetchAuthSession } from "aws-amplify/auth";
import WebSocketService from "src/services/websocket.service";
import { useNavigate } from "react-router-dom";

const env = import.meta.env;

const verifier = CognitoJwtVerifier.create({
    userPoolId: `${env.VITE_COGNITO_USER_POOL_ID}`,
    tokenUse: "id",
    clientId: `${env.VITE_COGNITO_CLIENT_ID}`
});

const getUserId = async (token: string): Promise<authPayload> => {
    const payload = await verifier.verify(token);

    return {
        userId: (payload.sub as string)
    };
};

const getUserToken = async () => {
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken?.toString();

    return idToken || null;
}

export function useSelectTopic(selected_topic: string) {
    const token = getUserToken.toString();
    const navigation = useNavigate();

    if (token == null)
        return 'Error';


    const [topic, setTopic] = useState('');
    const [userId, setUserId] = useState('');
    const [elo, setElo] = useState(0);

    getUserId(token).then((data) => {
        setUserId(data.userId);
    })


    useEffect(() => {
        setTopic(selected_topic);

        axios.post('http://localhost:3030/elo', JSON.stringify({ user_id: userId }))
            .then((res) => {
                if (res.status === 200)
                    setElo(res.data.elo)
                else
                    return { response: 'error', message: res.data.message }
            })
    }, [])

    const selectTopic = () => {

        const data = JSON.stringify({
            type: 'ENQUEUE',
            game_mode: topic,
            id: userId,
            elo: elo
        })

        const { socket } = WebSocketService();

        try {
            // send request to add user to matchmaking queue
            socket?.send(data);
        }
        catch {
            return Error;
        }

        navigation('/searching');
    }
}