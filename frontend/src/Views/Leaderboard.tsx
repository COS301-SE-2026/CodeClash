import profile from '../assets/Icons/Profile.png';
import shadow from '../assets/shadow.png';
import winner from '../assets/Icons/winner.png';
import planet from '../assets/Planets/Earth.png';
import background from '../assets/Background/leaderboard_background.png';
import '../styles/global.css';
import {Link} from 'react-router-dom';
import { type LeaderboardProps } from 'src/Models/LeaderboardModel';
import { LeaderboardUserData } from 'src/Models/LeaderboardModel';
import light from '../assets/light.png';


// const Leaderboard: React.FC<LeaderboardProps> = (
const Leaderboard = (
    //{
//     league = 'earth',
//     prev_page = "/dashboard",
//     firstUser = LeaderboardUserData,
//     secondUser = LeaderboardUserData,
//     thirdUser = LeaderboardUserData,
//     fourthUser = LeaderboardUserData,
//     fifthUser = LeaderboardUserData,
//     sixthUser = LeaderboardUserData,
//     sevthUser = LeaderboardUserData,
//     eigthUser = LeaderboardUserData,
//     ninthUser = LeaderboardUserData,
//     tenthUser = LeaderboardUserData
// 
//}
) => {
    
    return(
    // <div className="w-full min-h-screen bg-[#C0395A]">
    // <div className="w-2/3 bg-[#C0395A]">
    
    // <h1 className="mt-13 ml-80 text-[64px] text-[#FFDBE4] font-[var(--font)] font-heading-weight drop-shadow-[4px_4px_0px_rgba(0,0,0,0.25)]">Leader Board</h1>
    // <div className="grid grid-flow-col grid-cols-3 gap-6">
    //     <div className="ml-5 w-[239px] h-[304px] rounded-[20px] bg-[#FAC8D0] border-4 border-[#F4A0B2] drop-shadow-[10px_10px_6px_rgba(0,0,0,0.25)]"></div>
    //     <div style={{backgroundImage: `url(${winner})`}} className="w-[524px] h-[524px] bg-cover bg-center bg-no-repeat"></div>
    // </div>
    // </div>
    // </div>
    <div className="w-full min-h-screen bg-[#C0395A]">
        <Link to="/dashboard" className="text-[#530A24] font-[var(--font)] text-[32px] font-semibold ml-5">← Back</Link>
        <h1 className="text-[60px] text-[#FFDBE4] text-center -mt-1 mr-230 font-[var(--font)] font-semibold drop-shadow-[4px_4px_0px_rgba(0,0,0,0.25)]">Leader Board</h1>
        
        <div className="flex justify-between items-start gap-10">
            <div className="w-2/3 flex flex-col gap-6">
            <div className="grid grid-cols-3 gap-9 items-end">
            <div className="ml-10 mb-40 w-[239px] h-[304px] rounded-[20px] bg-[#FAC8D0] border-4 border-[#F4A0B2] drop-shadow-[10px_10px_6px_rgba(0,0,0,0.25)] flex flex-col items-center justify-center"></div>
            <div style={{backgroundImage: `url(${winner})`}} className="w-[524px] h-[524px] mt-2 -ml-49 bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center"></div>
            <div className="-ml-35 mb-40 w-[239px] h-[304px] rounded-[20px] bg-[#FAC8D0] border-4 border-[#F4A0B2] drop-shadow-[-10px_10px_6px_rgba(0,0,0,0.25)] flex flex-col items-center justify-center"></div>
            </div>
            </div>
        </div>
    </div>
    );
}

export default Leaderboard;
