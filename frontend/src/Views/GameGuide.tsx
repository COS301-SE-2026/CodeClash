import bg from "../../src/assets/Background/solar_system.jpg"
import "../../src/styles/global.css"
import GameGuideCard from "@/components/ui/gameGuideCard";
import GameGuideHeading from "@/components/ui/gameGuideHeading";
import GameGuideNumberCard from "@/components/ui/gameGuideNumber";
import { GameGuideCardText } from "@/components/ui/gameGuideCard";

const GameGuide = () => {


    return(

        <div style={{backgroundImage: `url(${bg})`}} className="w-full min-h-screen overflow-y-auto bg-no-repeat object-cover bg-no-repeat bg-size-[auto_200%]">

            <div className="bg-[#000000]/20 mx-auto mt-[1%] w-[95%] h-[145%] rounded-[20px] backdrop-blur-sm border-10 border-[var(--color-pink-700)]">
                <div className="font-font font-bold text-secondary text-[270%] mx-auto text-center mt-[3%]">CODECLASH - Game Guide</div>
                <div className="flex flex-col grid grid-cols-2 grid rows-2 w-[90%] h-[30%] mx-auto ml-[2%] mt-[4%]">

                    {/* the text below is pasted from a wireframe, no AI was utilised in the generation of any of this code */}
                    
                    <div className="w-[120%] font-font font-bold text-[#FFFFFF] text-[200%] mx-auto">
                        This game guide serves to provide everything needed to get started with CodeClash. Learn how matches work, understand the scoring system, explore the game rules, and discover tips to improve your performance. Whether you’re a first time player or a seasoned competitor, this guide will help you navigate the platform, make the most of every challenge, and compete with confidence.
                    </div>
                    <div className="ml-[6%] flex flex-col grid grid-cols-2">
                    <div className="bg-[var(--color-pink-700)] w-[20%] h-[11%] text-[#FFFFFF] text-[160%] font-bold font-font text-center ml-[50%]">AGE:</div>
                        <div className="text-[#FFFFFF] text-[160%] font-bold font-font -ml-[20%]">13+ Years</div>
                    
                    <div className="bg-[var(--color-pink-700)] w-[40%] h-[12%] text-[#FFFFFF] text-[160%] font-bold font-font text-center ml-[50%] -mt-[50%]">PLATFORM:</div>
                        <div className="text-[#FFFFFF] text-[160%] font-bold font-font ml-[2%] -mt-[50%]">WINDOWS & MAC OS</div>
                    </div>
                </div>

                <div className="bg-[var(--color-pink-700)] w-[22%] h-[3%] text-[#FFFFFF] text-[260%] font-bold font-font text-center -mt-[15%] ml-[2%]">SCORING SYSTEM</div>
                
                {/* the text below was copied and pasted from a wireframe, no AI was used to generate any of this code */}
                
                <div className="w-[95%] text-[#FFFFFF] text-[190%] font-bold font-font ml-[2%] mt-[1%] mx-auto">
                    Every answer submitted is automatically compared against the correct solution using the game's validation system. Correct answers earn points, while incorrect answers receive no score. If multiple players answer correctly, the player who submits the correct solution in the shortest amount of time receives a higher score, rewarding quick thinking under pressure. This balanced scoring system ensures that success is determined not only by being fast, but also by writing accurate and correct solutions. At the end of each match, players can review their results, compare their performance, and identify areas for improvement before taking on their next challenge
                </div>

                {/* the text below was copied and pasted from a wireframe, no AI was used to generate any of this code */}
                <div className="bg-[var(--color-pink-700)] w-[22%] h-[3%] text-[#FFFFFF] text-[260%] font-bold font-font text-center mt-[4%] ml-[2%]">PLAYER JOURNEY</div>
                    <div className="w-[95%] text-[#FFFFFF] text-[190%] font-bold font-font ml-[2%] mt-[1%] mx-auto">
                        Casual matches provide a safe space to practice, build confidence, and develop problem-solving skills without the pressure of rankings. As players gain experience, improve their accuracy, and become more confident in solving challenges, they can progress into ranked matches where every game contributes to their competitive standing.
                            Success in ranked play rewards players with progression through the league system, allowing them to climb the leaderboard while competing against opponents of similar skill levels. Along the way, players unlock achievements and earn badges that celebrate milestones such as winning matches, maintaining high accuracy, answering quickly, or demonstrating consistent improvement.
                    </div>
                
                <div className="bg-[var(--color-pink-700)] w-[22%] h-[3%] text-[#FFFFFF] text-[260%] font-bold font-font text-center mt-[4%] ml-[2%]">HOW TO PLAY</div>
                <div className="flex flex-col grid grid-cols-2">
                    <div className="flex flex-row grid grid-rows-4">
                    <GameGuideCard className="ml-[5%] mt-[5%] w-[80%] h-[50%]">
                        <GameGuideNumberCard className="h-[60%]">
                            <GameGuideHeading className="-mt-[10%]">
                                1
                            </GameGuideHeading>
                        </GameGuideNumberCard>
                        <GameGuideCardText className="-ml-[60%]">
                            {/* the text below was copied and pasted from an old page that has been redone here, no AI was used to generate any code on this page: */}
                            As you play and win more ranked matches, your ELO will increase until you're able to play in a new, more advanced league
                        </GameGuideCardText>
                    </GameGuideCard>

                    <GameGuideCard className="ml-[5%] mt-[1%] w-[80%] h-[50%]">
                        <GameGuideNumberCard className="h-[60%]">
                            <GameGuideHeading className="-mt-[10%]">
                                2
                            </GameGuideHeading>
                        </GameGuideNumberCard>
                        <GameGuideCardText className="-ml-[60%]">
                            {/* the text below was copied from an old page that has been redone here, no AI was used to generate any code on this page */}
                            Casual Play is for players who want to practise without impacting their ELO. Ranked Play is for players who want to put their skills to the test by battling against others (Be careful! This impacts your ELO!)
                        </GameGuideCardText>
                    </GameGuideCard>

                    <GameGuideCard className="ml-[5%] mt-[1%] w-[80%] h-[50%]">
                        <GameGuideNumberCard className="h-[50%]">
                            <GameGuideHeading>
                                3
                            </GameGuideHeading>
                        </GameGuideNumberCard>
                        <GameGuideCardText className="-ml-[60%]">
                            {/* the text below was copied from an old page that is being redone here, no AI was used to generate any code on this page */}
                            After selecting Play Now, wait until we find someone for you to battle against. Your opponent's ELO will be similar to yours!
                        </GameGuideCardText>
                    </GameGuideCard>

                    <GameGuideCard className="ml-[5%] mt-[10%] w-[80%]">
                        <GameGuideNumberCard className="h-[50%]">
                            <GameGuideHeading>
                                4
                            </GameGuideHeading>
                        </GameGuideNumberCard>
                        <GameGuideCardText className="-ml-[60%]">
                            {/* the text below was copied from an old page that is now being redone here, no AI was used to generate any of the code on this page */}
                            Now you're in a match! Make sure you answer questions quickly to score more points than your opponent, but make sure they're correct first else you get no points!
                        </GameGuideCardText>
                    </GameGuideCard>
                    </div>

                    <div className="flex flex-row grid grid-rows-3">
                        <GameGuideCard className="ml-[7%] mt-[10%] w-[80%]">
                            <GameGuideNumberCard className="h-[50%]">
                                <GameGuideHeading>
                                    5
                                </GameGuideHeading>
                            </GameGuideNumberCard>
                            <GameGuideCardText className="-ml-[60%]">
                                {/* the text below is copied and pasted from an old page that is now being redone here, none of the code in this page is AI generated */}
                                Make sure to pick up Powerups to boost your score and detriment your opponent's score, along the way!
                            </GameGuideCardText>
                        </GameGuideCard>

                        <GameGuideCard className="ml-[7%] mt-[10%] w-[80%]">
                            <GameGuideNumberCard className="h-[50%]">
                                <GameGuideHeading>
                                    6
                                </GameGuideHeading>
                            </GameGuideNumberCard>
                            <GameGuideCardText className="-ml-[60%]">
                                {/* the text below is copied and pasted from an old page that is now being redone here, none of the code on this page is AI generated */}
                                If you suspect your opponent of cheating, please select the Report a Match option in your Dashboard
                            </GameGuideCardText>
                        </GameGuideCard>

                        <GameGuideCard className="ml-[7%] mt-[10%] w-[80%]">
                            <GameGuideNumberCard className="h-[50%]">
                                <GameGuideHeading>
                                    7
                                </GameGuideHeading>
                            </GameGuideNumberCard>
                            <GameGuideCardText className="-ml-[60%]">
                                {/* the text below is copied and pasted from an old page that is now being redone here, none of the code on this page is AI generated */}
                                As you play and win more ranked matches, your ELO will increase until you're able to play in a new, more advanced league
                            </GameGuideCardText>
                        </GameGuideCard>
                    </div>
                </div>
            
            </div>


        </div>
    

    );



}


export default GameGuide;