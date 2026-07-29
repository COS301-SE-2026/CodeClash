import profile from '../assets/Icons/profile_black.png';
import { UserCircle } from 'lucide-react';
import winner from '../assets/Icons/winner.png';
import planet from '../assets/Planets/Earth.png';
import background from '../assets/Background/leaderboard_background.png';
import bg from '../assets/Background/leaderboardBG.jfif'
import '../styles/global.css';
import {Link} from 'react-router-dom';
import { LeaderboardViewModel } from 'src/ViewModels/LeaderboardViewModel';
import GlassCard from '@/components/shared/GlassCard';
import LeaderboardCardLeft, {LeaderboardCardRight, EloText} from '@/components/ui/leaderboardCard'


// const Leaderboard: React.FC<LeaderboardProps> = (
const Leaderboard = (league : string) => {
    
    return(
    <div style={{backgroundImage: `url(${bg})`}} className="w-full min-h-screen bg-cover bg-no-repeat object-cover">
        <Link to="/dashboard" className="text-secondary font-[var(--font)] text-[200%] font-semibold ml-5">← Back</Link>
        <div className="text-[340%] text-secondary text-center mr-[5%] font-[var(--font)] font-semibold drop-shadow-[4px_4px_0px_rgba(0,0,0,0.25)] ml-[4%]">Leader Board
        <div style={{backgroundImage: `url(${planet})`}} className="w-[105px] h-[105px] bg-no-repeat object-cover bg-size-[auto_92%] bg-[left_49%_top_55%] justify-center mx-auto -mt-[5%]"></div>
        </div>
        <GlassCard className="w-[80%] h-[50%] mx-auto mt-[1%]">
            <div className="flex grid grid-cols-3 gap-4 h-full w-full">
                <LeaderboardCardLeft className="mt-[7%] ml-[58%]"></LeaderboardCardLeft>
                <div style={{backgroundImage : `url(${winner})`}} className="w-[83%] h-[95%] bg-no-repeat object-cover bg-size-[auto_130%] bg-[left_49%_top_55%] justify-center mt-[10%] ml-[9.5%]">
                    <UserCircle className="w-[120px] h-[120px] bg-no-repeat rounded-full object-cover bg-size-[auto_200%] bg-[right_49.5%_top_49%] mx-auto"></UserCircle>
                    <div className="text-[360%] text-[#B39A48] text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">1</div>
                    <EloText className="text-[165%]">Username</EloText>
                    <EloText className="text-[165%]">ELO</EloText>
                </div>
                <LeaderboardCardRight className="mt-[7%]"></LeaderboardCardRight>
                <div className="w-[45%] h-[85%] rounded-[20px] border-4 border-button-primary bg-secondary ml-[58%] -mt-[15%]">
                    <div className="flex flex-col grid grid-cols-3">
                    <UserCircle className="w-[59px] h-[59px] bg-no-repeat rounded-full object-cover bg-size-[auto_200%] bg-[right_49%_top_50%]"></UserCircle>
                        <EloText className="text-[200%] -ml-[70%] -mt-[5%]">4</EloText>
                        <div className="flex flex-row grid grid-rows-2">
                        <div className="text-[80%] text-button-primary text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] -ml-[40%] mt-[2%]">Username</div>
                        <div className="text-[80%] text-button-primary text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] -mt-[5%]">ELO</div>
                        </div>
                    </div>
                </div>
                <div className="w-[45%] h-[85%] rounded-[20px] border-4 border-button-primary bg-secondary ml-[103%] -mt-[15%]">
                    <div className="flex flex-col grid grid-cols-3">
                    <UserCircle className="w-[59px] h-[59px] bg-no-repeat rounded-full object-cover bg-size-[auto_200%] bg-[right_49%_top_50%]"></UserCircle>
                        <EloText className="text-[200%] -ml-[70%] -mt-[5%]">5</EloText>
                        <div className="flex flex-row grid grid-rows-2">
                        <div className="text-[80%] text-button-primary text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] -ml-[40%] mt-[2%]">Username</div>
                        <div className="text-[80%] text-button-primary text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] -mt-[5%]">ELO</div>
                        </div>
                    </div>
                </div>
            </div>
       
        </GlassCard>
          
            
         
            <div className="ml-25% w-[full] h-[30%]"></div>
             <div className="">
             <div style={{backgroundImage: `url(${background})`}} className="w-[80%] h-[70%] rounded-[20px] bg-no-repeat bg-cover bg-center bg-size-[auto_500%] -mt-[16%] ml-[10%] overflow-y-auto">
                 <div className="grid grid-rows-5 gap-1 items-end">
                     <div className="ml-[12%] h-[70%] w-[75%] rounded-[20px] bg-blend-normal bg-secondary backdrop-blur-lg">
                         <UserCircle className="mt-0.75 w-[42px] h-[42px] bg-no-repeat rounded-full object-cover bg-size-[auto_85px] bg-[right_-21.5px_top_-21.5px]"></UserCircle>
                         <div className="-ml-110 -mt-10 text-[24px] text-button-primary text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">Username</div>
                         <div className="ml-75 -mt-9 text-[24px] text-button-primary text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">ELO</div>
                         <div className="ml-190 -mt-10.5 text-[32px] text-button-primary text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">6</div>
                     </div>
                     <div className="mt-4 ml-[12%] h-[70%] w-[75%] rounded-[20px] bg-blend-normal bg-secondary backdrop-blur-lg">
                         <div style={{backgroundImage: `url(${profile})`}} className="mt-0.5 w-[42px] h-[42px] bg-no-repeat rounded-full object-cover bg-size-[auto_85px] bg-[right_-21.5px_top_-21.5px]"></div>
                         <div className="-ml-110 -mt-10 text-[24px] text-button-primary text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">Username</div>
                         <div className="ml-75 -mt-9 text-[24px] text-button-primary text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">ELO</div>
                         <div className="ml-190 -mt-10.5 text-[32px] text-button-primary text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">7</div>
                     </div>
                     <div className="mt-4 ml-[12%] h-[70%] w-[75%] rounded-[20px] bg-blend-normal bg-secondary backdrop-blur-lg">
                         <div style={{backgroundImage: `url(${profile})`}} className="mt-0.5 w-[42px] h-[42px] bg-no-repeat rounded-full object-cover bg-size-[auto_85px] bg-[right_-21.5px_top_-21.5px]"></div>
                         <div className="-ml-110 -mt-10 text-[24px] text-button-primary text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">Username</div>
                         <div className="ml-75 -mt-9 text-[24px] text-button-primary text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">ELO</div>
                         <div className="ml-190 -mt-10.5 text-[32px] text-button-primary text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">8</div>
                     </div>
                     <div className="mt-4 ml-[12%] h-[70%] w-[75%] rounded-[20px] bg-blend-normal bg-secondary backdrop-blur-lg">
                         <div style={{backgroundImage: `url(${profile})`}} className="mt-0.5 w-[42px] h-[42px] bg-no-repeat rounded-full object-cover bg-size-[auto_85px] bg-[right_-21.5px_top_-21.5px]"></div>
                         <div className="-ml-110 -mt-10 text-[24px] text-button-primary text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">Username</div>
                         <div className="ml-75 -mt-9 text-[24px] text-button-primary text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">ELO</div>
                         <div className="ml-190 -mt-10.5 text-[32px] text-button-primary text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">9</div>
                     </div>
                     <div className="-mt-[1%] ml-[12%] h-[70%] w-[75%] rounded-[20px] bg-blend-normal bg-secondary backdrop-blur-lg">
                         <div style={{backgroundImage: `url(${profile})`}} className="mt-0.75 w-[42px] h-[42px] bg-no-repeat rounded-full object-cover bg-size-[auto_85px] bg-[right_-21.5px_top_-21.5px]"></div>
                         <div className="-ml-110 -mt-10 text-[24px] text-button-primary text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">Username</div>
                         <div className="ml-75 -mt-9 text-[24px] text-button-primary text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">ELO</div>
                        <div className="ml-190 -mt-10.5 text-[32px] text-button-primary text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">10</div>
                    </div>
                </div>
            </div>
            </div>
            </div>

        
);
}

    


export default Leaderboard;
