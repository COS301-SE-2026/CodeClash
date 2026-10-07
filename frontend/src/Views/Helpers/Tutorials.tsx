import React from "react";
import Starfield from "@/components/ui/animations/Starfield";

type Tutorial = {
    title: string;
    src: string;
    description?: string;
}

const tutorial: Tutorial[] = [
    {
        title: "1. How to play a competitive match",
        src: '',
        description: ''
    },
    {
        title: "2. How to view the results and statistics of your match",
        src: '',
        description: ''
    },
    {
        title: "3. How to play in or host a tournament",
        src: '',
        description: ''
    }
]

const Tutorials: React.FC = () => {
    return (
        <div className="relative w-full min-h-screen overflow-hidden bg-background text-text">
            <Starfield/>
            
        </div>
    )
}
export default Tutorials;