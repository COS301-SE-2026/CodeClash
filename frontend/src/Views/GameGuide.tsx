import bg from "../../src/assets/Background/solar_system.jpg"
import "../../src/styles/global.css"
import GameGuideCard from "@/components/ui/gameGuideCard";
import GameGuideHeading from "@/components/ui/gameGuideHeading";
import GameGuideNumberCard from "@/components/ui/gameGuideNumber";
import { GameGuideCardText } from "@/components/ui/gameGuideCard";

const GameGuide = () => {


    return(

        <div style={{backgroundImage: `url(${bg})`}} className="w-full min-h-screen overflow-y-auto bg-no-repeat object-cover bg-no-repeat bg-size-[auto_200%]">

            <div className="bg-[#000000]/20 mx-auto mt-[1%] w-[95%] h-[95%] rounded-[20px] backdrop-blur-sm border-10 border-[var(--color-pink-700)]">
                <div className="font-font font-bold text-secondary text-[270%] mx-auto text-center mt-[3%]">CODECLASH - Game Guide</div>
                <div className="flex flex-col grid grid-cols-2 grid rows-2 w-[90%] h-[30%] mx-auto ml-[2%] mt-[4%]">

                    {/* the text below is pasted from a wireframe, no AI was utilised in the generation of any of this code */}
                    
                    <div className="w-[120%] font-font font-bold text-[#FFFFFF] text-[200%] mx-auto">
                        This game guide serves to provide everything needed to get started with CodeClash. Learn how matches work, understand the scoring system, explore the game rules, and discover tips to improve your performance. Whether you’re a first time player or a seasoned competitor, this guide will help you navigate the platform, make the most of every challenge, and compete with confidence.
                    </div>
                    <div className="ml-[6%] flex flex-col grid grid-cols-2">
                    <div className="bg-[var(--color-pink-700)] w-[20%] h-[25%] text-[#FFFFFF] text-[160%] font-bold font-font text-center ml-[50%]">AGE:</div>
                        <div className="text-[#FFFFFF] text-[160%] font-bold font-font -ml-[20%]">13+ Years</div>
                    
                    <div className="bg-[var(--color-pink-700)] w-[35%] h-[25%] text-[#FFFFFF] text-[160%] font-bold font-font text-center ml-[50%] -mt-[5%]">PLATFORM:</div>
                        <div className="text-[#FFFFFF] text-[160%] font-bold font-font ml-[2%] -mt-[5%]">WINDOWS & MAC OS</div>
                    </div>
                </div>

                <div className="bg-[var(--color-pink-700)] w-[22%] h-[6%] text-[#FFFFFF] text-[260%] font-bold font-font text-center mt-[10%] ml-[2%]">SCORING SYSTEM</div>
                
                {/* the text below was copied and pasted from a wireframe, no AI was used to generate any of this code */}
                
                <div className="w-[95%] text-[#FFFFFF] text-[190%] font-bold font-font ml-[2%] mt-[1%] mx-auto">
                    Every answer submitted is automatically compared against the correct solution using the game's validation system. Correct answers earn points, while incorrect answers receive no score. If multiple players answer correctly, the player who submits the correct solution in the shortest amount of time receives a higher score, rewarding quick thinking under pressure. This balanced scoring system ensures that success is determined not only by being fast, but also by writing accurate and correct solutions. At the end of each match, players can review their results, compare their performance, and identify areas for improvement before taking on their next challenge
                </div>
            </div>


        </div>
    

    );



}


export default GameGuide;