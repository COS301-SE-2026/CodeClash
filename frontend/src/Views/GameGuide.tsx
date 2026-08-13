import bg from "../../src/assets/Background/solar_system.jpg"
import {Users, Monitor, Trophy, TrendingUp, Gamepad2} from 'lucide-react';

{/*All copied from Morgans previously written gameguide code*/}
const Steps = [ 
    "As you play and win more ranked matches, your ELO will increase until you're able to play in a new, more advanced league",
    "Casual Play is for players who want to practise without impacting their ELO. Ranked Play is for players who want to put their skills to the test by battling against others (Be careful! This impacts your ELO!)",
    "After selecting Play Now, wait until we find someone for you to battle against. Your opponent's ELO will be similar to yours!",
    "Now you're in a match! Make sure you answer questions quickly to score more points than your opponent, but make sure they're correct first else you get no points!",
    "Make sure to pick up Powerups to boost your score and detriment your opponent's score, along the way!",
    "If you suspect your opponent of cheating, please select the Report a Match option in your Dashboard",
    "As you play and win more ranked matches, your ELO will increase until you're able to play in a new, more advanced league"
]

const GameGuide = () => {
    return(
        <div style={{backgroundImage: `url(${bg})`}} className="relative w-full min-h-screen bg-cover bg-center overflow-hidde -m-8 p-8">
            <div className="relative z-10 max-w-[1100px] mx-auto flex flex-col gap-10 pb-10">
                <div className="text-center flex flex-col items-center gap-4">
                    <span className="eyebrow">Competitive - Coding - Mathematics</span>
                    <h1 className="text-3xl md:text-4xl font-black text-primary-text">CodeClash Game Guide</h1>
                    <p className="text-muted max-w-2xl leading-relaxed">
                        {/*Copied from Morgans previously written gameguide code */}
                        This game guide serves to provide everything needed to get started with CodeClash. Learn how matches work, understand the scoring system, explore the game rules, and discover tips to improve your performance. Whether you are a first time player or a seasoned competitor, this guide will help you navigate the platform, make the most of every challenge, and compete with confidence.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
                        <span className="badge border border-border bg-card text-primary-text">
                            <Users size={14}/>Age 13+
                        </span>
                        <span className="badge border border-border bg-card text-primary-text">
                            <Monitor size={14}/>Windows &amp; Mac OS
                        </span>
                    </div>
                </div>

            </div>
        </div>
    )
}
export default GameGuide;



















{/*This is kept from Morgans previous game guide!!

Every answer submitted is automatically compared against the correct solution using the game's validation system. Correct answers earn points, while incorrect answers receive no score. If multiple players answer correctly, the player who submits the correct solution in the shortest amount of time receives a higher score, rewarding quick thinking under pressure. This balanced scoring system ensures that success is determined not only by being fast, but also by writing accurate and correct solutions. At the end of each match, players can review their results, compare their performance, and identify areas for improvement before taking on their next challenge

Casual matches provide a safe space to practice, build confidence, and develop problem-solving skills without the pressure of rankings. As players gain experience, improve their accuracy, and become more confident in solving challenges, they can progress into ranked matches where every game contributes to their competitive standing.
Success in ranked play rewards players with progression through the league system, allowing them to climb the leaderboard while competing against opponents of similar skill levels. Along the way, players unlock achievements and earn badges that celebrate milestones such as winning matches, maintaining high accuracy, answering quickly, or demonstrating consistent improvement.*/}
