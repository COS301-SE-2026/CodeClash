import background from "../assets/Background/gameguideBG.png"
import { Link } from "react-router-dom";
import "../styles/global.css"
import GlassCard from "@/components/shared/GlassCard";
import GameGuideCard from "../../@/components/ui/gameGuideCard";
import GameGuideNumberCard from "../../@/components/ui/gameGuideNumber"
import GameGuideHeading from "../../@/components/ui/gameGuideHeading"
import { GameGuideCardText } from "../../@/components/ui/gameGuideCard";
import matchPlay from "../../src/assets/matchPlay.png";
import matchSearch from "../../src/assets/search_match.png"
import playNow from "../../src/assets/play_now.png"
import score from "../../src/assets/score.png"

const Guidebook = () => {



return(
    <div style={{backgroundImage: `url(${background})`}} className="w-full min-h-screen overflow-hidden bg-no-repeat object-cover bg-size-[auto_110%] bg-[right_40%_top_50%]">
        <Link to="/dashboard" className="text-button-primary font-[var(--font)] text-[200%] font-semibold ml-5">← Back</Link>
        <h1 className="text-[450%] text-button-primary text-center justify-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] -mt-[1%] -ml-[3%]">Game Guide</h1>
        <GlassCard className="w-[90%] h-[80%] mx-auto">
        <div className="flex grid grid-cols-4 gap-4">
        <div className="flex grid grid-rows-6 gap-15 w-[100%] mt-[10%] ml-[5%]"> 
        <GameGuideCard className="ml-[8%]">
            <GameGuideNumberCard className="ml-[1%]">
               <GameGuideHeading>1</GameGuideHeading>
            </GameGuideNumberCard>
            <GameGuideCardText className="-ml-[62%] mr-[5%] text-[105%]">First select "Play Now" on the bottom left corner of your Dashboard and choose what type of match you want to play.</GameGuideCardText>
        </GameGuideCard>
        <GameGuideCard className="ml-[8%]">
            <GameGuideNumberCard className="ml-[1%]">
                <GameGuideHeading>2</GameGuideHeading>
            </GameGuideNumberCard>
            <GameGuideCardText className="-ml-[62%] mr-[5%] text-[85%]">Casual Play is for players who want to practise without impacting their ELO. Ranked Play is for players who want to put their skills to the test by battling against others (Be careful! This impacts your ELO!)"</GameGuideCardText>
        </GameGuideCard>
        <GameGuideCard className="ml-[8%]">
            <GameGuideNumberCard className="ml-[1%]"> 
                <GameGuideHeading>3</GameGuideHeading>
            </GameGuideNumberCard>
            <GameGuideCardText className="-ml-[62%] mr-[5%] text-[110%]">After selecting Play Now, wait until we find someone for you to battle against. Your opponent's ELO will be similar to yours!</GameGuideCardText>
        </GameGuideCard>
        <GameGuideCard className="ml-[8%]">
            <GameGuideNumberCard className="ml-[1%]">
                <GameGuideHeading>4</GameGuideHeading>
            </GameGuideNumberCard>
            <GameGuideCardText className="-ml-[62%] mr-[5%] text-[100%]">Now you're in a match! Make sure you answer questions quickly to score more points than your opponent, but make sure they're correct first else you get no points!</GameGuideCardText>
        </GameGuideCard>
        <GameGuideCard className="ml-[8%]">
            <GameGuideNumberCard className="ml-[1%]">
                <GameGuideHeading>5</GameGuideHeading>
            </GameGuideNumberCard>
            <GameGuideCardText className="-ml-[62%] mr-[5%] text-[105%]">Make sure to pick up Powerups to boost your score and detriment your opponent's score, along the way!</GameGuideCardText>
        </GameGuideCard>
        {/* <GameGuideCard className="ml-[8%]">
            <GameGuideNumberCard className=" ml-[1%] -mt-[6.5%]">
                <GameGuideHeading>6</GameGuideHeading>
            </GameGuideNumberCard>
        </GameGuideCard> */}
        </div>

        <div className="flex grid grid-rows-3 gap-15 ml-[7%]">
        <div style={{backgroundImage: `url(${playNow})`}} className="bg-no-repeat object-cover bg-size-[auto_48%] ml-[30%] mt-[12%]"></div>
        <div style={{backgroundImage: `url(${matchSearch})`}} className="bg-no-repeat object-cover bg-size-[auto_45%] ml-[30%] mt-[8%]"></div>
        <div style={{backgroundImage: `url(${matchPlay})`}} className="bg-no-repeat object-cover bg-size-[auto_49%] ml-[30%] -mt-[7%]"></div>
        </div>

        <div className="flex grid grid-rows-6 gap-15 w-[100%] mt-[10%]">
            <GameGuideCard>
                <GameGuideNumberCard className="ml-[1%]">
                    <GameGuideHeading>6</GameGuideHeading>
                </GameGuideNumberCard>
                <GameGuideCardText className="-ml-[62%] mr-[5%] text-[105%]">If you suspect your opponent of cheating, please select the Report a Match option in your Dashboard</GameGuideCardText>
            </GameGuideCard>
            <GameGuideCard>
                <GameGuideNumberCard className="ml-[1%]">
                    <GameGuideHeading>7</GameGuideHeading>
                </GameGuideNumberCard>
                <GameGuideCardText className="-ml-[62%] mr-[5%] text-[105%]">As you play and win more ranked matches, your ELO will increase until you're able to play in a new, more advanced league</GameGuideCardText>
            </GameGuideCard>
        </div>

        <div className="flex grid grid-rows-3 gap-15">
            <div style={{backgroundImage: `url(${score})`}} className="bg-no-repeat object-cover bg-size-[auto_35%] ml-[22%] mt-[12%]"></div>
        </div>

        </div>
        </GlassCard>
    </div>
);



}

export default Guidebook;