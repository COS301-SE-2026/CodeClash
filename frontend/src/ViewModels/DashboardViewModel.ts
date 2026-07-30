import { useState } from "react"

export function useShowPopUp() {
    const [isOpen, setIsOpen] = useState(false);

    const openPopUp = () => setIsOpen(true);
    const closePopUp = () => setIsOpen(false);

    return { isOpen, openPopUp, closePopUp };
}
