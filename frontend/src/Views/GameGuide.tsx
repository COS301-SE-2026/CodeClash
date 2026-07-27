import bg from "../../src/assets/Background/solar_system.jpg"
import GlassCard from "@/components/shared/GlassCard";
import "../../src/styles/global.css"

const GameGuide = () => {


    return(

        <div style={{backgroundImage: `url(${bg})`}} className="w-full min-h-screen overflow-y-auto bg-no-repeat object-cover bg-no-repeat bg-size-[auto_200%]">

            <div className="bg-[#000000]/20 mx-auto mt-[1%] w-[95%] h-[95%] rounded-[20px] backdrop-blur-sm border-10 border-[var(--color-pink-700)]">
                <div className="font-font font-bold text-secondary text-[230%] mx-auto text-center mt-[3%]">CODECLASH - Game Guide</div>
                <div className="flex flex-col grid grid-cols-2 grid rows-2 w-[90%] h-[30%] mx-auto ml-[1.5%] mt-[4%]">

                    {/* the text below is pasted from a wireframe, no AI was utilised in the generation of any of this code */}
                    
                    <div className="w-[120%] border border-white font-font font-bold text-[#FFFFFF] text-[190%] mx-auto">
                        This game guide serves to provide everything needed to get started with CodeClash. Learn how matches work, understand the scoring system, explore the game rules, and discover tips to improve your performance. Whether you’re a first time player or a seasoned competitor, this guide will help you navigate the platform, make the most of every challenge, and compete with confidence.
                    </div>
                    <div className="flex flex-col grid grid-cols-2">
                    <div className="bg-[var(--color-pink-700)] w-[15%] h-[11%] text-[#FFFFFF] text-[140%] font-bold font-font text-center ml-[50%]">AGE:</div>
                        <div className="text-[#FFFFFF] text-[140%] font-bold font-font -ml-[30%]">13+ Years</div>
                    </div>
                </div>
            </div>


        </div>
    

    );



}


export default GameGuide;