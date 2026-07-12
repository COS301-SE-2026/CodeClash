import profile from '../assets/Icons/profile_black.png';
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
    <div style={{backgroundImage: `url(${shadow})`}} className="w-full min-h-screen bg-[#C0395A] bg-no-repeat object-cover bg-size-[auto_150px] bg-[19%_60%]">
        <Link to="/dashboard" className="text-[#530A24] font-[var(--font)] text-[32px] font-semibold ml-5">← Back</Link>
        <h1 className="text-[60px] text-[#FFDBE4] text-center -mt-1 mr-230 font-[var(--font)] font-semibold drop-shadow-[4px_4px_0px_rgba(0,0,0,0.25)]">Leader Board</h1>
        
        <div className="flex justify-between items-start gap-10">
            <div className="relative w-2/3 flex flex-col gap-6">
            <div className="grid grid-cols-3 gap-9 items-end">
            <div className="ml-10 mb-40 w-[239px] h-[304px] rounded-[20px] bg-[#FAC8D0] border-4 border-[#F4A0B2] drop-shadow-[10px_10px_6px_rgba(0,0,0,0.25)] flex flex-col items-center justify-center">
                <div style={{backgroundImage: `url(${profile})`}} className="w-[90px] h-[90px] bg-no-repeat rounded-full object-cover bg-size-[auto_180px] bg-[right_-45px_top_-45px] -mt-60">
                <div className="text-[64px] text-[#CECBC2] text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] mt-22">2</div>
                <div className="text-[32px] text-[#C0395A] text-center justify-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] -ml-7">Username</div>
                <div className="text-[32px] text-[#C0395A] text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">ELO</div>
                </div>
            </div>
            <div style={{backgroundImage: `url(${winner})`}} className="w-[524px] h-[524px] mt-2 -ml-49 bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center">
                <div style={{backgroundImage: `url(${profile})`}} className="w-[120px] h-[120px] bg-no-repeat rounded-full object-cover bg-size-[auto_240px] bg-[right_-60px_top_-60px] -mt-30"></div>
                <div className="text-[64px] text-[#B39A48] text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] -mt-2">1</div>
                <div className="text-[32px] text-[#C0395A] text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] mb-1">Username</div>
                <div className="text-[32px] text-[#C0395A] text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">ELO</div>
            </div>
            <div className="-ml-35 mb-40 w-[239px] h-[304px] rounded-[20px] bg-[#FAC8D0] border-4 border-[#F4A0B2] drop-shadow-[-10px_10px_6px_rgba(0,0,0,0.25)] flex flex-col items-center justify-center">
                <div style={{backgroundImage: `url(${profile})`}} className="w-[90px] h-[90px] bg-no-repeat rounded-full object-cover bg-size-[auto_180px] bg-[right_-45px_top_-45px] -mt-12"></div>
                <div className="text-[64px] text-[#B36548] text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">3</div>
                <div className="text-[32px] text-[#C0395A] text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">Username</div>
                <div className="text-[32px] text-[#C0395A] text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">ELO</div>
            </div>
            <div className="mb-40 -mt-40 ml-10 w-[239px] h-[77px] rounded-[20px] bg-[#FAC8D0] border-4 border-[#F4A0B2] drop-shadow-[10px_10px_6px_rgba(0,0,0,0.25)]">
                <div style={{backgroundImage: `url(${profile})`}} className="mt-1.5 w-[60px] h-[60px] bg-no-repeat rounded-full object-cover bg-size-[auto_120px] bg-[right_-30px_top_-30px]"></div>
                <div className="-mt-17 -ml-14 text-[48px] text-[#FF5B8F] text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">4</div>
                <div className="-mt-16 ml-25 text-[20px] text-[#C0395A] text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">Username</div>
                <div className="ml-38 text-[21px] text-[#C0395A] text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">ELO</div>
            </div>
            <div className="mb-40 -mt-40 ml-75 w-[239px] h-[77px] rounded-[20px] bg-[#FAC8D0] border-4 border-[#F4A0B2] drop-shadow-[-10px_10px_6px_rgba(0,0,0,0.25)]">
                <div style={{backgroundImage: `url(${profile})`}} className="mt-1.5 w-[60px] h-[60px] bg-no-repeat rounded-full object-cover bg-size-[auto_120px] bg-[right_-30px_top_-30px]"></div>
                <div className="-mt-17 -ml-15 text-[48px] text-[#FF5B8F] text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">5</div>
                <div className="-mt-16 ml-25 text-[20px] text-[#C0395A] text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">Username</div>
                <div className="ml-38 text-[21px] text-[#C0395A] text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">ELO</div>
            </div>
            </div>
            <div style={{backgroundImage: `url(${light})`}} className="absolute -top-35 -left-5 w-[1100px] h-[1000px] bg-no-repeat bg-cover bg-center bg-size-[auto_1000px]"></div>
            <div style={{backgroundImage: `url(${background})`}} className=" absolute left-10 -bottom-60.5 w-[935px] h-[350px] rounded-[20px] bg-no-repeat bg-cover bg-center bg-size-[auto_700px]">
                <div className="grid grid-rows-5 gap-1 items-end">
                    <div className="mt-4.25 ml-8 h-[47px] w-[870px] rounded-[20px] bg-blend-normal bg-[#FFEFE0] backdrop-blur-lg">
                        <div style={{backgroundImage: `url(${profile})`}} className="mt-0.75 w-[42px] h-[42px] bg-no-repeat rounded-full object-cover bg-size-[auto_85px] bg-[right_-21.5px_top_-21.5px]"></div>
                    </div>
                    <div className="mt-4 ml-8 h-[47px] w-[870px] rounded-[20px] bg-blend-normal bg-[#FFEFE0] backdrop-blur-lg">
                        <div style={{backgroundImage: `url(${profile})`}} className="mt-0.5 w-[42px] h-[42px] bg-no-repeat rounded-full object-cover bg-size-[auto_85px] bg-[right_-21.5px_top_-21.5px]"></div>
                    </div>
                    <div className="mt-4 ml-8 h-[47px] w-[870px] rounded-[20px] bg-blend-normal bg-[#FFEFE0] backdrop-blur-lg">
                        <div style={{backgroundImage: `url(${profile})`}} className="mt-0.5 w-[42px] h-[42px] bg-no-repeat rounded-full object-cover bg-size-[auto_85px] bg-[right_-21.5px_top_-21.5px]"></div>
                    </div>
                    <div className="mt-4 ml-8 h-[47px] w-[870px] rounded-[20px] bg-blend-normal bg-[#FFEFE0] backdrop-blur-lg"></div>
                    <div className="mt-4 ml-8 h-[47px] w-[870px] rounded-[20px] bg-blend-normal bg-[#FFEFE0] backdrop-blur-lg"></div>
                </div>
            </div>
            </div>
        </div>
    </div>
    );
}

export default Leaderboard;
