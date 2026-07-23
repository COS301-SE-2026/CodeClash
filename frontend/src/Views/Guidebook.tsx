import background from "../assets/Background/gameguideBG.png"
import { Link } from "react-router-dom";
import "../styles/global.css"
import GlassCard from "@/components/shared/GlassCard";
import GameGuideCard from "../../@/components/ui/gameGuideCard";
import GameGuideNumberCard from "../../@/components/ui/gameGuideNumber"
import GameGuideHeading from "../../@/components/ui/gameGuideHeading"
import { GameGuideCardText } from "../../@/components/ui/gameGuideCard";

const Guidebook = () => {



return(
    <div style={{backgroundImage: `url(${background})`}} className="w-full min-h-screen overflow-hidden bg-no-repeat object-cover bg-size-[auto_110%] bg-[right_40%_top_50%]">
        <Link to="/dashboard" className="text-button-primary font-[var(--font)] text-[200%] font-semibold ml-5">← Back</Link>
        <h1 className="text-[450%] text-button-primary text-center justify-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] -mt-5">Game Guide</h1>
        <GlassCard className="w-[90%] h-[80%] mx-auto">
        <div className="flex grid grid-cols-4 gap-4">
        <div className="flex grid grid-rows-6 gap-7 w-[100%] mt-[17%]"> 
        <GameGuideCard className="w-[120%] h-[80%] ml-[8%]">
            <GameGuideNumberCard className="w-[34%] h-[100%] ml-[1%] -mt-[5%]">
               <GameGuideHeading>1</GameGuideHeading>
            </GameGuideNumberCard>
            <GameGuideCardText className="-ml-[62%] -mt-[2%] text-[70%]">First select "Play Now" on your Dashboard and choose what type of match you want to play</GameGuideCardText>
        </GameGuideCard>
        <GameGuideCard className="w-[120%] h-[80%] ml-[8%]">
            <GameGuideNumberCard className="w-[34%] h-[100%] ml-[1%] -mt-[6.5%]">
                <GameGuideHeading>2</GameGuideHeading>
            </GameGuideNumberCard>
            <GameGuideCardText className="-ml-[62%] -mt-[8%] text-[62%]">Casual Play is for players who want to practise without impacting their ELO. Ranked Play is for players who want to put their skills to the test by battling against others (Be careful! This impacts your ELO!)"</GameGuideCardText>
        </GameGuideCard>
        <GameGuideCard className="w-[120%] h-[80%] ml-[8%]">
            <GameGuideNumberCard className="w-[34%] h-[100%] ml-[1%] -mt-[6.5%]"> 
                <GameGuideHeading>3</GameGuideHeading>
            </GameGuideNumberCard>
            <GameGuideCardText className="-ml-[62%] -mt-[7%] text-[70%]">After selecting Play Now, wait until we find someone for you to battle against. Your opponent's ELO will be similar to yours!</GameGuideCardText>
        </GameGuideCard>
        <GameGuideCard className="w-[120%] h-[80%] ml-[8%]">
            <GameGuideNumberCard className="w-[34%] h-[100%] ml-[1%] -mt-[6.5%]">
                <GameGuideHeading>4</GameGuideHeading>
            </GameGuideNumberCard>
        </GameGuideCard>
        <GameGuideCard className="w-[120%] h-[80%] ml-[8%]">
            <GameGuideNumberCard className="w-[34%] h-[100%] ml-[1%] -mt-[6.5%]">
                <GameGuideHeading>5</GameGuideHeading>
            </GameGuideNumberCard>
        </GameGuideCard>
        {/* <GameGuideCard className="w-[120%] h-[70%] ml-[8%]">
            <GameGuideNumberCard className="w-[34%] h-[100%] ml-[1%] -mt-[6.5%]">
                <GameGuideHeading>6</GameGuideHeading>
            </GameGuideNumberCard>
        </GameGuideCard> */}
        </div>
        </div>
        </GlassCard>
    </div>
);



}

export default Guidebook;