import background from "../assets/Background/gameguideBG.png"
import { Link } from "react-router-dom";
import "../styles/global.css"
import GlassCard from "@/components/shared/GlassCard";

const Guidebook = () => {



return(
    <div style={{backgroundImage: `url(${background})`}} className="w-full min-h-screen overflow-hidden bg-no-repeat object-cover bg-size-[auto_1200px] bg-[right_-20px_top_-70px]">
        <Link to="/dashboard" className="text-button-primary font-[var(--font)] text-[32px] font-semibold ml-5">← Back</Link>
        <h1 className="text-[80px] text-button-primary text-center justify-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] -mt-5">Game Guide</h1>
      
    </div>
);



}

export default Guidebook;