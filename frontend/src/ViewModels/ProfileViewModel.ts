import { useNavigate } from "react-router-dom";

import { useAuth } from "../../src/context/Auth/hooks/useAuth";
import { useUser } from "../../src/context/User/hooks/useUser";
import type { ProfileProps } from "src/Models/ProfileModel";
import { useState, useEffect } from "react";

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

export function useProfile() {

    const { username, elo, avatar, league, rank } = useUser();
    const [userData, setUserData] = useState<ProfileProps | null>(null);
    const [loadingData, setLoadingData] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        try {
            const user: ProfileProps = {
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
    }, [username, elo, avatar, league]);

    return { userData: userData, loadingData: loadingData, error: error as Error };
}

