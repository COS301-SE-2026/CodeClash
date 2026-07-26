import bg from "../../src/assets/Background/solar_system.jpg"
import GlassCard from "@/components/shared/GlassCard";
import "../../src/styles/global.css"

const GameGuide = () => {


    return(

        <div style={{backgroundImage: `url(${bg})`}} className="w-full min-h-screen overflow-y-auto bg-no-repeat object-cover bg-no-repeat bg-size-[auto_200%]">

            <div className="bg-[#000000]/20 mx-auto mt-[1%] w-[95%] h-[95%] rounded-[20px] backdrop-blur-sm border-10 border-[#530A24]">
                <h1 className="font-font font-bold text-secondary text-[230%] mx-auto text-center mt-[3%]">CODECLASH - Game Guide</h1>
                <div className="flex flex-col grid grid-cols-2 grid rows-2">
    
                </div>
            </div>


        </div>
    

    );



}


export default GameGuide;