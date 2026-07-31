import {useState, useEffect} from 'react'
import { useNavigate } from "react-router-dom";
import { useAuth } from "src/context/Auth/hooks/useAuth";
import { useUser } from "src/context/User/hooks/useUser";
import type { ProfileProps } from "src/Models/ProfileModel";

export function useLogOut() {
    const { signOut } = useAuth();
    const nav = useNavigate();

    const logout = async () => {

        try {

            await signOut();
            nav('/welcome');
        } catch (err) {
            console.error(`Error logging out: ${err}`)
        }
    }

    return logout
}

export function useEdit() {
    const edit = async () => { }

    return edit;
}

export async function getProfile() {


    const [userData, setUserData] = useState<ProfileProps | null>(null);
    const [loadingData, setLoadingData] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function loadUser(){
            try{
                const {username, elo, avatar, league, rank} = useUser();
                
                const user : ProfileProps = {
                    username,
                    elo,
                    avatar, 
                    league,
                    rank
                };
                
                setUserData(user);
            } catch (err) {
                setError(err as Error);
            }

            finally {
                setLoadingData(false);
            }
        }
        loadUser();
    }, []);

    return {userData, loadingData, error};
}
