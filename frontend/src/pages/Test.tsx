import '../styles/global.css'
import React from "react"


const Test: React.FC = () => {

    return(
        <div className="min-h-screen w-full bg-[var(--secondary)] flex items-center justify-center p-6 bg-[url(./robot.png)] bg-center bg-no-repeat bg-size-[auto_800px]">
            <div className="relative w-xl">
                {/* <img src='./robot.png' alt="robot" className="relative w-full z-0 inset-0"></img> */}

                <div className="bg-[var(--secondary)] w-full border rounded-3xl pt-12 pb-8 text-center shadow-lg absolute -top-9 h-120">
                    <h1 className="text-6xl font-[var(--heading)] text-[var(--secondary-text)] font-extrabold ">
                        Choose a Topic
                    </h1>
                    <h2 className="text-2xl font-[var(--heading)] text-[var(--secondary-text)] text-center justify-center mt-5">What would you like to be challenged on?</h2>
                </div>
            </div>
        </div>
    );

};


export default Test;