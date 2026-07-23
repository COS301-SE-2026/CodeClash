import background from "../assets/Background/gameguideBG.png"
import { Link } from "react-router-dom";
import "../styles/global.css"
import GlassCard from "@/components/shared/GlassCard";
import GameGuideCard from "../../@/components/ui/gameGuideCard";
import GameGuideNumberCard from "../../@/components/ui/gameGuideNumber"
import GameGuideHeading from "../../@/components/ui/gameGuideHeading"

const Guidebook = () => {



return(
    <div style={{backgroundImage: `url(${background})`}} className="w-full min-h-screen overflow-hidden bg-no-repeat object-cover bg-size-[auto_110%] bg-[right_40%_top_50%]">
        <Link to="/dashboard" className="text-button-primary font-[var(--font)] text-[200%] font-semibold ml-5">← Back</Link>
        <h1 className="text-[450%] text-button-primary text-center justify-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] -mt-5">Game Guide</h1>
        <GlassCard className="w-[90%] h-[80%] mx-auto">
        <div className="flex grid grid-cols-4 gap-4">
        <div className="flex grid grid-rows-6 gap-4 w-[100%] mt-[7%]"> 
        <GameGuideCard className="w-[110%] h-[70%] ml-[8%]">
            <GameGuideNumberCard className="w-[34%] h-[100%] ml-[1%] -mt-[7%]">
               <GameGuideHeading>1</GameGuideHeading>
            </GameGuideNumberCard>
            <h1 className="">test</h1>
        </GameGuideCard>
        <GameGuideCard className="w-[110%] h-[70%] ml-[8%]">
            <GameGuideNumberCard className="w-[16%] h-[100%] ml-[1%] -mt-[4%]">
                <GameGuideHeading>2</GameGuideHeading>
            </GameGuideNumberCard>
        </GameGuideCard>
        <GameGuideCard className="w-[110%] h-[70%] ml-[8%]">
            <GameGuideNumberCard className="w-[16%] h-[100%] ml-[1%] -mt-[4%]"> 
                <GameGuideHeading>3</GameGuideHeading>
            </GameGuideNumberCard>
        </GameGuideCard>
        <GameGuideCard className="w-[110%] h-[70%] ml-[8%]">
            <GameGuideNumberCard className="w-[16%] h-[100%] ml-[1%] -mt-[4%]">
                <GameGuideHeading>4</GameGuideHeading>
            </GameGuideNumberCard>
        </GameGuideCard>
        <GameGuideCard className="w-[110%] h-[70%] ml-[8%]">
            <GameGuideNumberCard className="w-[16%] h-[100%] ml-[1%] -mt-[4%]">
                <GameGuideHeading>5</GameGuideHeading>
            </GameGuideNumberCard>
        </GameGuideCard>
        <GameGuideCard className="w-[110%] h-[70%] ml-[8%]">
            <GameGuideNumberCard className="w-[16%] h-[100%] ml-[1%] -mt-[4%]">
                <GameGuideHeading>6</GameGuideHeading>
            </GameGuideNumberCard>
        </GameGuideCard>
        </div>
        </div>
        </GlassCard>
    </div>
);



}

export default Guidebook;