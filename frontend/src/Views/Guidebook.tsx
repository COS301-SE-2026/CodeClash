import background from "../assets/Background/gameguideBG.png"
import { Link } from "react-router-dom";
import "../styles/global.css"
import GlassCard from "@/components/shared/GlassCard";
import GameGuideCard from "../../@/components/ui/gameGuideCard";
import GameGuideNumberCard from "../../@/components/ui/gameGuideNumber"

const Guidebook = () => {



return(
    <div style={{backgroundImage: `url(${background})`}} className="w-full min-h-screen overflow-hidden bg-no-repeat object-cover bg-size-[auto_110%] bg-[right_40%_top_50%]">
        <Link to="/dashboard" className="text-button-primary font-[var(--font)] text-[32px] font-semibold ml-5">← Back</Link>
        <h1 className="text-[80px] text-button-primary text-center justify-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] -mt-5">Game Guide</h1>
        <GlassCard className="w-[90%] h-[80%] mx-auto">   
        <GameGuideCard className="w-[30%] h-[10%] ml-[2%]">
            <GameGuideNumberCard className="w-[16%] h-[100%] ml-[1%] -mt-[3%]">
                <h1 className="text-center font-font font-semibold text-[120%] text-button-primary -mt-[26%] -ml-[3%]">1</h1>
            </GameGuideNumberCard>
        </GameGuideCard>
        </GlassCard>
    </div>
);



}

export default Guidebook;