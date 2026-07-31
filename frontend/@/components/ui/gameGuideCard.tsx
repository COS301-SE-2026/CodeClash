import type React from 'react'

import { Card } from "../ui/card"
import "../../../src/styles/global.css"

interface GameGuideCardProps{
    children?: React.ReactNode
    className?: string
}

const GameGuideCard = ({children, className} : GameGuideCardProps) => {

    return(
        <Card className={`bg-secondary/10 rounded-2xl backdrop-blur-lg border border-white/30 flex grid grid-cols-2 -gap-10 w-[120%] h-[100%]
            ${className}
        `}>
            {children}
            </Card>
    )


}

export default GameGuideCard;

interface GameGuideCardTextProps{
    children?: React.ReactNode
    className?: string
}

export const GameGuideCardText = ({children, className} : GameGuideCardTextProps) => {
    return(
        <h1 className={`font-font font-semibold text-[#FFFFFF] mx-auto
            ${className}
        `}>
            {children}
        </h1>
    )
}

