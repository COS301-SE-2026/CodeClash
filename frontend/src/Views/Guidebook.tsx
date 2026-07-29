import { Link } from "react-router-dom";

import book from "../assets/Icons/book.png"
import "../styles/global.css"

const Guidebook = () => {



return(
    <div style={{backgroundImage: `url(${book})`}} className="w-full min-h-screen overflow-hidden bg-no-repeat object-cover bg-size-[auto_2100px] bg-[right_-430px_top_-350px]">
        <Link to="/dashboard" className="text-[#E8466E] font-[var(--font)] text-[32px] font-semibold ml-5">← Back</Link>
        <h1 className="text-[70px] text-[#E8466E] text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] -ml-235">Game Guide</h1>
        <div className="relative w-1/2 flex flex-col gap-10 -mt-5 overflow-hidden">
            <div className="grid grid-cols-2 grid-rows-4 gap-9 items-end relative overflow-hidden">
                <div className="ml-25 mt-10 w-[160px] h-[160px] rounded-[20px] bg-[#FFD3DF] drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] relative">
                    <h1 className="font-silkscreen text-center text-[#E8466E] text-[64px] drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] absolute top-6 left-14">1</h1>
                </div>
                <div className="relative w-[550px] h-[91px] bg-secondary opacity-[94%] rounded-[20px] border-[#F4A0B2] border-4 drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] mb-8 -ml-40">
                    <h1 className="text-[#E8466E] text-[24px] font-silkscreen drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] absolute top-5.5 left-32">Game Instruction 1</h1>
                </div>
                <div className="w-[160px] h-[160px] rounded-[20px] bg-[#FFD3DF] drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] ml-25 mb-4 relative">
                    <h1 className="font-silkscreen text-center text-[#E8466E] text-[64px] drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] absolute top-6 left-14">2</h1>
                </div>
                <div className="w-[550px] h-[91px] bg-secondary opacity-[94%] rounded-[20px] border-[#F4A0B2] border-4 drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] mb-12 -ml-40 relative">
                    <h1 className="text-[#E8466E] text-[24px] font-silkscreen drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] absolute top-5.5 left-32">Game Instruction 2</h1>
                </div>
                <div className="w-[160px] h-[160px] rounded-[20px] bg-[#FFD3DF] drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] ml-25 mb-6.5 relative">
                    <h1 className="font-silkscreen text-center text-[#E8466E] text-[64px] drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] absolute top-6 left-14">3</h1>
                </div>
                <div className="w-[550px] h-[91px] bg-secondary opacity-[94%] rounded-[20px] border-[#F4A0B2] border-4 drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] mb-17 -ml-40 relative">
                    <h1 className="text-[#E8466E] text-[24px] font-silkscreen drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] absolute top-5.5 left-32">Game Instruction 3</h1>
                </div>
                <div className="w-[160px] h-[160px] rounded-[20px] bg-[#FFD3DF] drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] ml-25 mb-10 relative">
                    <h1 className="font-silkscreen text-center text-[#E8466E] text-[64px] drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] absolute top-6 left-14">4</h1>
                </div>
                <div className="w-[550px] h-[91px] bg-secondary opacity-[94%] rounded-[20px] border-[#F4A0B2] border-4 drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] mb-19 -ml-40 relative">
                    <h1 className="text-[#E8466E] text-[24px] font-silkscreen drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] absolute top-5.5 left-32">Game Instruction 4</h1>
                </div>
            </div>
        </div>
        <div className="h-screen relative w-1/2 flex flex-col gap-10 ml-242 -mt-255.5 overflow-hidden">
            <div className="grid grid-cols-2 grid-rows-5 items-end relative overflow-hidden ml-25 mt-5">
                <div className="w-[160px] h-[160px] rounded-[20px] bg-[#FFD3DF] drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] relative mb-10">
                    <h1 className="font-silkscreen text-center text-[#E8466E] text-[64px] drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] absolute top-6 left-14">5</h1>
                </div>
                <div className="w-[550px] h-[91px] bg-secondary opacity-[94%] rounded-[20px] border-[#F4A0B2] border-4 drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] mb-19 -ml-50 -mb-5 relative">
                    <h1 className="text-[#E8466E] text-[24px] font-silkscreen drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] absolute top-5.5 left-32">Game Instruction 5</h1>
                </div>
                <div className="w-[160px] h-[160px] rounded-[20px] bg-[#FFD3DF] drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] relative mb-5">
                    <h1 className="font-silkscreen text-center text-[#E8466E] text-[64px] drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] absolute top-6 left-14">6</h1>
                </div>
                <div className="w-[550px] h-[91px] bg-secondary opacity-[94%] rounded-[20px] border-[#F4A0B2] border-4 drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] mb-15 -ml-50 relative">
                    <h1 className="text-[#E8466E] text-[24px] font-silkscreen drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] absolute top-5.5 left-32">Game Instruction 6</h1>
                </div>
                <div className="w-[160px] h-[160px] rounded-[20px] bg-[#FFD3DF] drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] relative -mb-1">
                    <h1 className="font-silkscreen text-center text-[#E8466E] text-[64px] drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] absolute top-6 left-14">7</h1>
                </div>
                <div className="w-[550px] h-[91px] bg-secondary opacity-[94%] rounded-[20px] border-[#F4A0B2] border-4 drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] mb-8 -ml-50 relative">
                    <h1 className="text-[#E8466E] text-[24px] font-silkscreen drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] absolute top-5.5 left-32">Game Instruction 7</h1>
                </div>
            </div>
        </div>
    </div>
);



}

export default Guidebook;