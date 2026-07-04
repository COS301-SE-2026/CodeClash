import { useState } from "react"
import { useAuth } from "../context/AuthContext";

export function useShowPopUp() {
    const [isOpen, setIsOpen] = useState(false);

    const openPopUp = () => setIsOpen(true);
    const closePopUp = () => setIsOpen(false);

    return { isOpen, openPopUp, closePopUp };
}


export function useUserInfo() {
    const { user } = useAuth();

    return { username: user?.username }
}