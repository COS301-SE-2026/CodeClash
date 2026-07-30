import { useNavigate } from "react-router-dom";
import { useAuth } from "src/context/Auth/hooks/useAuth";
import { useUser } from "src/context/User/hooks/useUser";
import { useAuth } from "src/context/Auth/hooks/useAuth";
import { useUser } from "src/context/User/hooks/useUser";
import { getCurrentUser, fetchUserAttributes } from "aws-amplify/auth";
import type { ProfileProps } from "src/Models/ProfileModel";
import type { ProfileProps } from "src/Models/ProfileModel";
import {useState, useEffect} from 'react'

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

    //this is a very quickly done function that may be wrong, please correct if necessary

    const [userData, setUserData] = useState<ProfileProps | null>(null);
    const [loadingData, setLoadingData] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function loadUser(){
            try{
                const {username, elo, avatar, league, rank} = await useUser();
                
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
