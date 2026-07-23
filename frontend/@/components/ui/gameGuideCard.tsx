import type React from 'react'
import { Card } from "../ui/card"
import "../../../src/styles/global.css"

interface gameGuideCardProps{
    children?: React.ReactNode
    className?: string
}

const GameGuideCard = ({children, className} : gameGuideCardProps) => {

    return(
        <Card className={`bg-secondary/10 rounded-2xl backdrop-blur-lg border border-white/30 flex grid grid-cols-2 -gap-10 w-[120%] h-[100%]
            ${className}
        `}>
            {children}
            </Card>
    )


}

export default GameGuideCard;

interface gameGuideCardTextProps{
    children?: React.ReactNode
    className?: string
}

export const GameGuideCardText = ({children, className} : gameGuideCardTextProps) => {
    return(
        <h1 className={`font-font font-semibold text-[#FFFFFF] mx-auto
            ${className}
        `}>
            {children}
        </h1>
    )
}

