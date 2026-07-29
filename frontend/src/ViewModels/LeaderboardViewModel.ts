import { useState, useEffect, useCallback } from 'react'
// import type { LeaderboardUserProps } from 'src/Models/LeaderboardModel';
import { fetchLeaderboard, type LeaderboardEntry, type LeaderboardUserProps } from 'src/Models/LeaderboardModel';


export function LeaderboardViewModel(league : string){
    const [userData, setUserData] = useState<LeaderboardUserProps[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadLeaderboard = useCallback(async () => { //useCallback is used so that returned data is cached until any values of the returned data is changed
        setIsLoadingData(true);
        setError(null);
        try{
            const data = await fetchLeaderboard(10);
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

    const topTen = userData.slice(0,10);

   return {userData, topTen, isLoadingData, error, refresh: loadLeaderboard}


}