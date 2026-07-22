import type React from "react";
import { Card } from "./card";

interface gameGuideNumberProps{
    children?: React.ReactNode
    className?: string
}

const GameGuideNumberCard = ({children, className} : gameGuideNumberProps) => {

    return(

        <Card className={`bg-secondary rounded-full border-button-primary border-3`}></Card>


    )


}
