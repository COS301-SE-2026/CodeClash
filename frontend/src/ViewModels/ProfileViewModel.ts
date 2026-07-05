import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

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


}
