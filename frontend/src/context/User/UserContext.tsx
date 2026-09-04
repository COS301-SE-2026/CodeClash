import React, { useEffect, useMemo, useState, type ReactNode } from "react";
import { robot_map } from "src/assets/Robots";
import { API } from "src/services/api.service";
import { useAuth } from "../Auth/hooks/useAuth";

import { UserContext } from "./UserContextValue";

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [elo, setElo] = useState(0);
    const [avatar, setAvatar] = useState('');
    const [error, setError] = useState('');
    const [league, setLeague] = useState('');
    const { user, token} = useAuth();
    const [rank, setRank] = useState(0);
<<<<<<< HEAD
=======
    const { user, token } = useAuth();
    const [current_streak, setCurrentStreak] = useState<number>(0);
    const [winning_streak, setWinningStreak] = useState<number>(0);

>>>>>>> 5378a30cd86c953bdc20aa94765d31b947e8a4e4
    const userId = user?.userId ?? ""
    const username = user?.username ?? '';


    const getElo = async () => {

        if (!token) {
            setError('Missing or Invalid Token');
            return;
        }


        try {
<<<<<<< HEAD

            API.get('elo/elo-get', {
=======
            await axios.get(url.concat('elo/elo-get'), {
>>>>>>> 5378a30cd86c953bdc20aa94765d31b947e8a4e4
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
<<<<<<< HEAD
            API.get('user/avatar_id', {
=======
            await axios.get(url.concat('user/avatar_id'), {
>>>>>>> 5378a30cd86c953bdc20aa94765d31b947e8a4e4
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
<<<<<<< HEAD
            API.get('user/league', {
=======
            axios.get(url.concat('user/league'), {
>>>>>>> 5378a30cd86c953bdc20aa94765d31b947e8a4e4
                headers: { Authorization: `Bearer ${token}` }
            })
                .then((res) => {
                    if (res.status === 200) {
                        setLeague(res.data.league);
                    }
                    else {
                        setError(`Error: ${res.status} ${res.data}`);
                    }
                })
<<<<<<< HEAD

=======
>>>>>>> 5378a30cd86c953bdc20aa94765d31b947e8a4e4
        }
        catch (error) {
            setError(`Error Getting User League: ${error}`);
        }
    }


    const refresh = async () => {
        await Promise.all([
            getElo(),
            getAvatarUrl(),
            getLeague()
        ]);
    }

    const getRank = async () => {

        if (!token) {
            setError('Missing or Invalid Token');
            return;
        }

        try {
            await API.get('user/rank', {
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

<<<<<<< HEAD
=======
    const getCurrentStreak =  async () => {
        if (!token) {
            setError('Missing or Invalid Token');
            return;
        }
        try{
            const res = await axios.get(url.concat('user/current_streak'), {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.status === 200) setCurrentStreak(res.data.current_streak);
        }catch (error) {
            console.error('getCurrentRank failed', error);
        }
    };

    const getWinningStreak =  async () => {
        if (!token) {
            setError('Missing or Invalid Token');
            return;
        }
        try{
            const res = await axios.get(url.concat('user/winning_streak'), {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.status === 200) setWinningStreak(res.data.winning_streak);
        }catch (error) {
            console.error('getCurrentRank failed', error);
        }
    };
    const refresh = async () =>{
        await Promise.all([
            getElo(),
            getAvatarUrl(),
            getLeague(),
            getRank(),
            getCurrentStreak(),
            getWinningStreak()
        ])
    }

>>>>>>> 5378a30cd86c953bdc20aa94765d31b947e8a4e4

    useEffect(() => {

        if (!token) return;

        const load = async () => {
            await Promise.all([
                getAvatarUrl(),
                getLeague(),
                getElo(),
<<<<<<< HEAD
                getRank()
=======
                getRank(),
                getCurrentStreak(), // copied from above
                getWinningStreak()
>>>>>>> 5378a30cd86c953bdc20aa94765d31b947e8a4e4
            ]);
        }

        void load();
    }, [token])


    const value = useMemo(() => ({
<<<<<<< HEAD
        username, elo, avatar, error, league, userId, refresh,rank
    }), [username, elo, avatar, error, league, userId,rank])
=======
        username, elo, avatar, error, league, userId, refresh, rank, current_streak, winning_streak
    }), [username, elo, avatar, error, league, userId, rank, current_streak, winning_streak])
>>>>>>> 5378a30cd86c953bdc20aa94765d31b947e8a4e4

    return (
        <UserContext.Provider
            value={value}
        >
            {children}
        </UserContext.Provider>
    )
}