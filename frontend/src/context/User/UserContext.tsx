import React, { useEffect, useMemo, useState, useRef, type ReactNode } from "react";
import { authGet } from "src/services/api.service";
import { useInventory } from "../Shop/InventoryContext";
import { useAuth } from "../Auth/hooks/useAuth";
import LeagueUp, { LeagueDown, LEAGUES } from "@/components/ui/animations/LeagueUp";
import { playSfx } from "src/utils/audio";
import { UserContext } from "./UserContextValue";

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [elo, setElo] = useState(0);
    const [error, setError] = useState('');
    const [league, setLeague] = useState('');
    const { user, token } = useAuth();
    const [rank, setRank] = useState(0);
    const [current_streak, setCurrentStreak] = useState<number>(0);
    const [winning_streak, setWinningStreak] = useState<number>(0);

    const userId = user?.userId ?? ""
    const username = user?.username ?? '';

    const {equippedAvatarImage} = useInventory();
    const avatar = equippedAvatarImage ?? "";

    const leagueRef = useRef<string | null>(null);
    const [leagueEvent, setLeagueEvent] = useState<{
        league: string;
        direction: 'up' | 'down';
        trigger: number;
    }>({ league: '', direction: 'up', trigger: 0})


    const getElo = async () => {
        try {
            const data = await authGet<{ elo: number }>('user/elo', token!);
            setElo(data.elo);
        } catch (error) {
            setError(`Error Getting User Elo: ${error}`);  ///TODO: connect to notification system

        }
    }

    const getLeague = async () => {
        try {
            const data = await authGet<{ league: string }>('user/league', token!);
            const next = data.league;
            const prev = leagueRef.current;

            //skip after the first "load", only applies when the load brings in changes
            if(prev !== null && prev !== next){
                const order = Object.keys(LEAGUES);
                const prevIndex = order.indexOf(prev.toLowerCase());
                const nextIndex = order.indexOf(next.toLowerCase());

                if(prevIndex !== -1 && nextIndex !== -1 && prevIndex !== nextIndex){
                    setLeagueEvent(e => ({
                        league: next,
                        direction: nextIndex > prevIndex ? 'up' : 'down',
                        trigger: e.trigger + 1
                    }));
                }
                
            }
            leagueRef.current = next;
            setLeague(next);

        }
        catch (error) {
            setError(`Error Getting User League: ${error}`); ///TODO: connect to notification system
        }
    }


    const getRank = async () => {

        try {
            const data = await authGet<{ rank: number }>('user/rank', token!);
            setRank(data.rank);
        }
        catch (error) {
            setError(`Error Getting User Rank: ${error}`); ///TODO: connect to notification system
        }

    }

    const getCurrentStreak = async () => {
        try {
            const data = await authGet<{ current_streak: number }>('user/current_streak', token!);
            setCurrentStreak(data.current_streak);
        }
        catch (error) {
            console.error('getCurrentRank failed', error);
        }
    };

    const getWinningStreak = async () => {
        try {
            const data = await authGet<{ winning_streak: number }>('user/winning_streak', token!);
            setWinningStreak(data.winning_streak);
        }
        catch (error) {
            console.error('getCurrentRank failed', error);
        }
    };

    const refresh = async () => {

        if (!token) return;
        
        await Promise.all([
            getElo(),
            getLeague(),
            getRank(),
            getCurrentStreak(),
            getWinningStreak()
        ])
    }


    useEffect(() => {

        if (!token) return;

        const load = async () => {
            await Promise.all([
                getLeague(),
                getElo(),
                getRank(),
                getCurrentStreak(), // copied from above
                getWinningStreak()
            ]);
        }

        void load();
    }, [token])


    const value = useMemo(() => ({
        username, elo, avatar, error, league, userId, refresh, rank, current_streak, winning_streak
    }), [username, elo, avatar, error, league, userId, rank, current_streak, winning_streak])

    return (
        <UserContext.Provider
            value={value}
        >
            {children}

            {leagueEvent.trigger > 0 && (leagueEvent.direction === "up"
                ? <LeagueUp key={leagueEvent.trigger} league={leagueEvent.league} trigger={leagueEvent.trigger}>
                    {playSfx(`rank_up`)}
                </LeagueUp>
                : <LeagueDown key={leagueEvent.trigger} league={leagueEvent.league} trigger={leagueEvent.trigger}>
                    {playSfx(`rank_down`)}
                </LeagueDown>
            )
            }
        </UserContext.Provider>
    )
}