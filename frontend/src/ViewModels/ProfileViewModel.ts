import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export function useLogOut() {
    const { user, error, signOut } = useAuth();
    const nav = useNavigate();

    const logout = async () => {

        try {

            await signOut();
            nav('/welcome');
        } catch (err) {
            console.log(`Error logging out: ${err}`)
        }
    }

    return logout
}