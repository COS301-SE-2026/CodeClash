import { useAuth } from "src/context/useAuth";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, fetchUserAttributes } from "aws-amplify/auth";
import { ProfileProps } from "src/Models/ProfileModel";
import {useState, useEffect} from 'react'

export function useLogOut() {
    const { user, error, signOut } = useAuth();
    const nav = useNavigate();


    const logout = async () => {

        try {

            console.log(`logging user out: ${user}`)
            await signOut();
            nav('/welcome');
        } catch (err) {
            console.log(`Error logging out: ${err}`)
        }
    }

    return logout
}

export function useEdit() {
    const edit = async () => { }

    return edit;
}

export async function getProfile() {

    //this is a very quickly done function that may be wrong, it is meant to be presented to Oliver now, may be wrong!
    
    const [userData, setUserData] = useState<ProfileProps | null>(null);
    const [loadingData, setLoadingData] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function loadUser(){
            try{
                const {username} = await getCurrentUser();
                const {avatarUrl, rank, elo, league} = await fetchUserAttributes();
            }
        }
    })
}
