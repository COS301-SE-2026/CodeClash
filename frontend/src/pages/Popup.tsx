import '../styles/global.css'
import React from "react"

interface PopupProps{
    onMath? : () => void;
    onProg? : () => void;
    onCancel? : () => void;
}


const Popup: React.FC<PopupProps> = ({onMath, onProg, onCancel}) => {

    return(
        <div className="min-h-screen w-full bg-[var(--secondary)] flex items-center justify-center p-6 bg-[url(./robot.png)] bg-center bg-no-repeat bg-size-[auto_800px]">
            <div className="relative w-xl">
                {/* <img src='./robot.png' alt="robot" className="relative w-full z-0 inset-0"></img> */}

                <div className="bg-[var(--secondary)] w-full border rounded-3xl pt-12 pb-8 text-center drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] absolute -top-9 h-124">
                    <h1 className="text-6xl font-[var(--heading)] text-[var(--secondary-text)] font-extrabold ">
                        Choose a Topic
                    </h1>
                    <h2 className="text-2xl font-[var(--heading)] font-medium text-[var(--secondary-text)] text-center justify-center mt-5">What would you like to be challenged on?</h2>
                
                <div className="grid grid-flow-col grid-cols-2 gap-4 ml-8 mr-8 mt-16 h-45">
                    <div className="bg-[var(--secondary)] rounded-3xl text-center text-[var(--secondary-text)] drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] mr-2 transition-all duration-200 hover:bg-rose-200 hover:-translate-y-px active-translate-y-0" onClick={onMath}>
                        <h1 className="text-3.3xl text-[var(--secondary-text)] font-[var(--heading)] font-bold mt-5">+ -</h1>
                        <h2 className="text-3.3xl text-[var(--secondary-text)] font-[var(--heading)] font-bold mt-3">Math</h2>
                        </div>
                    <div className="bg-[var(--secondary)] rounded-3xl text-center text-[var(--secondary-text)] drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] ml-2 transition-all duration-200 hover:bg-rose-200 hover:-translate-y-px active-translate-y-0" onClick={onProg}>
                        <h1 className="text-3.3xl text-[var(--secondary-text)] font-[var(--heading)] font-bold mt-5">{"</>"}</h1>
                        <h2 className="text-3.3xl text-[var(--secondary-text)] font-[var(--heading)] font-bold mt-3">Programming</h2>
                    </div>
                </div>
                <div className="text-3.3xl text-black font-[var(--heading)] font-extrabold underline mt-5" onClick={onCancel}>Cancel</div>
                </div>
            </div>
        </div>
    );

};


export default Popup;