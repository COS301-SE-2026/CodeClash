import bg from "../../src/assets/Background/solar_system.jpg"
import GlassCard from "@/components/shared/GlassCard";
import "../../src/styles/global.css"

const GameGuide = () => {


    return(

        <div style={{backgroundImage: `url(${bg})`}} className="w-full min-h-screen overflow-y-auto bg-no-repeat object-cover bg-no-repeat bg-size-[auto_200%]">

            <div className="bg-[#000000]/20 mx-auto mt-[1%] w-[95%] h-[95%] rounded-[20px] backdrop-blur-sm border-10 border-[#530A24]">
                <h1 className="font-font font-bold text-secondary text-[230%] mx-auto text-center mt-[3%]">CODECLASH - Game Guide</h1>
                <div className="flex flex-col grid grid-cols-2 grid rows-2 w-[90%] h-[30%] border">

                    {/* the text below is pasted from a wireframe, no AI was utilised in the generation of any of this code */}
                    
                    <p className="font-font font-bold text-[#FFFFFF] text-[100%] mx-auto">
                        This game guide serves to provide everything needed to get started with CodeClash. Learn how matches work, understand the scoring system, explore the game rules, and discover tips to improve your performance. Whether you’re a first time player or a seasoned competitor, this guide will help you navigate the platform, make the most of every challenge, and compete with confidence.
                    </p>
                </div>
            </div>


        </div>
    

    );



}


export default GameGuide;