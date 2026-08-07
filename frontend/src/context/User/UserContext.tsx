import { type AuthUser } from "aws-amplify/auth";
import axios from "axios";
import React, { useEffect, useMemo, useState, type ReactNode } from "react";
import { robot_map } from "src/assets/Robots";

import { useAuth } from "../Auth/hooks/useAuth";

import { UserContext } from "./UserContextValue";



const url = import.meta.env.VITE_API_URL;

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [elo, setElo] = useState(0);
    const [avatar, setAvatar] = useState('');
    const [error, setError] = useState('');
    const [league, setLeague] = useState('');
    const [rank, setRank] = useState('');
    const { user, token, isLoading } = useAuth();

    const username = user?.username ?? '';


    const getElo = async () => {
        if (!token) {
            setError('Missing or Invalid Token');
            return;
        }

        try {
            await axios.get(url.concat('elo/elo-get'), {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then((res) => {
                    if (res.status === 200) {
                        setElo(res.data.rating)
                        setError('');
                    }
                    else {
                        setError(`Error: ${res.status} ${res.data}`);
                    }
                })
        } catch (error) {
            setError(`Error Getting User Elo: ${error}`);

        }
    }

    const getAvatarUrl = async () => {
        if (!token) {
            setError('Missing or Invalid Token');
            return;
        }

        try {
            await axios.get(url.concat('user/avatar_id'), {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then((res) => {
                    if (res.status === 200) {
                        const index = res.data.avatar_id;
                        setAvatar(robot_map[index]);
                    }
                    else {
                        setError(`Error: ${res.status} ${res.data}`);
                    }
                })
        }
        catch (error) {
            setError(`Error Getting User Avatar: ${error}`);
        }
    }


    const getLeague = async () => {
        if (!token) {
            setError('Missing or Invalid Token');
            return;
        }

        try {
            // await axios.get(url.concat('user/league'), {
            //     headers: { Authorization: `Bearer ${token}` }
            // })
            //     .then((res) => {
            //         if (res.status === 200) {
            //             setLeague(res.data.league);
            //         }
            //         else {
            //             setError(`Error: ${res.status} ${res.data}`);
            //         }
            //     })

            if(elo >= 0 && elo < 1200){ //change this to "elo >= 600", the lowest is 600, but test_user has an elo of 0 so that needs to be changed then this should be changed
                setLeague("Mercury");
            }
            else if(elo >= 1200 && elo < 1800){
                setLeague("Venus");
            }
            else if(elo >= 1800 && elo < 2400){
                setLeague("Earth");
            }
            else if(elo >= 2400 && elo < 3000){
                setLeague("Mars");
            }
            else if(elo >= 3000 && elo < 3600){
                setLeague("Jupiter");
            }
            else if(elo >= 3600 && elo < 4200){
                setLeague("Saturn");
            }
            else if(elo >= 4200 && elo < 4800){
                setLeague("Uranus");
            }
            else if(elo >= 4800 && elo <= 5400){
                setLeague("Neptune");
            }
            else{
                setError('Error: Invalid League');
            }

        }
        catch (error) {
            setError(`Error Getting User League: ${error}`);
        }
    }

    const getRank = async () => {

        if (!token) {
            setError('Missing or Invalid Token');
            return;
        }

        try {
            await axios.get(url.concat('user/rank'), {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then((res) => {
                    if (res.status === 200) {
                        setRank(res.data.rank);
                    }
                    else {
                        setError(`Error: ${res.status} ${res.data}`)
                    }
                })
        }
        catch (error) {
            setError(`Error Getting User Rank: ${error}`);
        }

    }


    useEffect(() => {
        if (!token) return;

        const load = async () => {
            getElo();
            getAvatarUrl()
            getLeague();
            getRank();
        }


        void load();
    }, [token])


    const value = useMemo(() => ({
        username, elo, avatar, error, league, rank
    }), [username, elo, avatar, error, league, rank])

    return (
        <UserContext.Provider
            value={value}
        >
            {children}
        </UserContext.Provider>
    )
}