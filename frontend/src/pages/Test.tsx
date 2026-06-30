import '../styles/global.css'
import React from "react"


const Test: React.FC = () => {

    return(
        <div className="min-h-screen w-full bg-[var(--secondary)] flex items-center justify-center p-6 bg-[url(./robot.png)] bg-center bg-no-repeat bg-size-[auto_700px]">
            <div className="size-1/3">
                <img src='./robot.png' alt="robot" className="relative w-full z-0 inset-0"></img>

                <div className="bg-[var(--secondary)] border rounded-3xl pt-20 pb-8 px-8 text-center shadow-sm top-8 z-10">

                </div>
            </div>
        </div>
    );

};


export default Test;