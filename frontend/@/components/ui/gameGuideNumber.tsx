import type React from "react";

import { Card } from "./card";

interface GameGuideNumberProps{
    children?: React.ReactNode
    className?: string
}

const GameGuideNumberCard = ({children, className} : GameGuideNumberProps) => {

    return(

        <Card className={`bg-secondary rounded-full border-button-primary border-3 text-center w-[30%] h-[70%] mt-[2%] drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] ${className}`}>
            {children}
        </Card>


    )


}

export default GameGuideNumberCard;