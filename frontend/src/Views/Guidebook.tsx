import book from "../assets/Icons/book.png"
import { Link } from "react-router-dom";
import "../styles/global.css"

const Guidebook = () => {



return(
    <div style={{backgroundImage: `url(${book})`}} className="w-full min-h-screen bg-no-repeat object-cover bg-size-[auto_2100px] bg-[right_-430px_top_-350px]">
        <Link to="/dashboard" className="text-[#E8466E] font-[var(--font)] text-[32px] font-semibold ml-5">← Back</Link>
        <h1 className="text-[70px] text-[#E8466E] text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] -ml-235">Game Guide</h1>
        <div className="relative w-1/2 flex flex-col">
        <div className="grid grid-cols-2 grid-rows-4 gap-5 items-end">
            <div className="w-[160px] h-[160px] rounded-[20px] bg-[#FFD3DF] drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] font-[var(--font-guidebook)] ml-25 mt-10">1</div>
            <div className="w-[550px] h-[91px] bg-[#FFEFE0] opacity-[94%] rounded-[20px] border-[#F4A0B2] border-4 drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] mb-7.5 -ml-40"></div>
            <div className="w-[160px] h-[160px] rounded-[20px] bg-[#FFD3DF] drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] ml-25 -mt-5"></div>
            <div className="w-[550px] h-[91px] bg-[#FFEFE0] opacity-[94%] rounded-[20px] border-[#F4A0B2] border-4 drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] mb-7.5 -ml-40"></div>
            <div className="w-[160px] h-[160px] rounded-[20px] bg-[#FFD3DF] drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] ml-25 -mt-5"></div>
            <div className="w-[550px] h-[91px] bg-[#FFEFE0] opacity-[94%] rounded-[20px] border-[#F4A0B2] border-4 drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] mb-7.5 -ml-40"></div>
            <div className="w-[160px] h-[160px] rounded-[20px] bg-[#FFD3DF] drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] ml-25 -mt-5"></div>
            <div className="w-[550px] h-[91px] bg-[#FFEFE0] opacity-[94%] rounded-[20px] border-[#F4A0B2] border-4 drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] mb-7.5 -ml-40"></div>
        </div>
        </div>
    </div>
);



}

export default Guidebook;