import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/Auth/hooks/useAuth";

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