import '../styles/global.css'
import React from "react"


const Test: React.FC = () => {

    return(
        <div className="min-h-screen w-full bg-[var(--secondary)] flex items-center justify-center p-6">
            <div className="size-1/3">
                <img src='./robot.png' alt="robot" className="w-full"></img>
            </div>
        </div>
    );

};


export default Test;