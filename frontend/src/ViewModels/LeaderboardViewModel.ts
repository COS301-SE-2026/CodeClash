import { useState, useEffect, useCallback } from 'react'
import type { LeaderboardUserProps } from 'src/Models/LeaderboardModel';
import { fetchLeaderboardUsers } from 'src/Models/LeaderboardModel';


export function LeaderboardViewModel(league : string){
    const [userData, setUserData] = useState<LeaderboardUserProps[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadLeaderboard = useCallback(async () => { //useCallback is used so that returned data is cached until any values of the returned data is changed
        setIsLoadingData(true);
        setError(null);
        try{
            const data = await fetchLeaderboardUsers(league);
            setUserData(data);
        }
        catch(err){
            setError('Could not load User Data');
        }
        finally{
            setIsLoadingData(false);
        }
    }, []);

    useEffect(() => {
        loadLeaderboard();
    }, [loadLeaderboard]);

    return {userData, isLoadingData, error, refresh: loadLeaderboard}



}