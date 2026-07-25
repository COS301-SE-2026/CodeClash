import {useNavigate} from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import { LeaderboardUserProps, LeaderboardProps, LeaderboardUserData, fetchLeaderboardUsers } from 'src/Models/LeaderboardModel'


export function LeaderboardViewModel(){
    const [userData, setUserData] = useState<LeaderboardUserProps[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadLeaderboard = useCallback(async () => {
        setIsLoadingData(true);
        setError(null);
        try{
            const data = await fetchLeaderboardUsers();
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

    const toReturn = new LeaderboardProps();

    

}