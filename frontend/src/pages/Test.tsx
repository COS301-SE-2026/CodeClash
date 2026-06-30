import '../styles/global.css'
import React from "react"


const Test: React.FC = () => {

    return(
        <div className="min-h-screen w-full bg-sky-50 flex items-center justify-center p-6">
            <button>TEST</button>
            <div className="relative w-full max-w-sm">
                <img src='./robot.png' alt="robot" className="w-full"></img>
            </div>
        </div>
    );

};


export default Test;