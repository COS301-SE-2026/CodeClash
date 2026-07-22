import type React from 'react'
import { Card } from "../ui/card"

interface gameGuideCardProps{
    children?: React.ReactNode
    className?: string
}

const GameGuideCard = ({children, className} : gameGuideCardProps) => {

    return(
        <Card className={`bg-[#FFEFE0]/10 rounded-2xl backdrop-blur-lg border border-white/30
            ${className}
        `}>
            {children}
            </Card>
    )



}

export default GameGuideCard;