import { useState } from "react"

export function useShowPopUp() {
    const [isOpen, setIsOpen] = useState(false);
    const [gameType, setGameType] = useState<'ranked' | 'casual' | null>(null);

    const openPopUp = (type: 'ranked' | 'casual') => {
        setGameType(type)
        setIsOpen(true);
    }
    const closePopUp = () => {
        setIsOpen(false);
        setGameType(null)
    }

    return { isOpen, openPopUp, closePopUp, gameType };
}


