import profile from '../assets/Icons/profile_black.png';
import shadow from '../assets/shadow.png';
import winner from '../assets/Icons/winner.png';
import planet from '../assets/Planets/Earth.png';
import background from '../assets/Background/leaderboard_background.png';
import '../styles/global.css';
import {Link} from 'react-router-dom';
import { LeaderboardViewModel } from 'src/ViewModels/LeaderboardViewModel';


// const Leaderboard: React.FC<LeaderboardProps> = (
const Leaderboard = (league : string) => {
    const {userData, isLoadingData, error, refresh} = LeaderboardViewModel(league);
    
    return(
    // <div className="w-full min-h-screen bg-button-primary">
    // <div className="w-2/3 bg-button-primary">
    
    // <h1 className="mt-13 ml-80 text-[64px] text-[#FFDBE4] font-[var(--font)] font-heading-weight drop-shadow-[4px_4px_0px_rgba(0,0,0,0.25)]">Leader Board</h1>
    // <div className="grid grid-flow-col grid-cols-3 gap-6">
    //     <div className="ml-5 w-[239px] h-[304px] rounded-[20px] bg-[#FAC8D0] border-4 border-[#F4A0B2] drop-shadow-[10px_10px_6px_rgba(0,0,0,0.25)]"></div>
    //     <div style={{backgroundImage: `url(${winner})`}} className="w-[524px] h-[524px] bg-cover bg-center bg-no-repeat"></div>
    // </div>
    // </div>
    // </div>
    <div style={{backgroundImage: `url(${shadow})`}} className="w-full min-h-screen bg-[#381421] bg-no-repeat object-cover bg-size-[auto_150px] bg-[37%_48%]">
        <Link to="/dashboard" className="text-secondary font-[var(--font)] text-[200%] font-semibold ml-5">← Back</Link>
        <h1 className="text-[340%] text-secondary text-center mr-[5%] font-[var(--font)] font-semibold drop-shadow-[4px_4px_0px_rgba(0,0,0,0.25)]">Leader Board</h1>
        
        <div className="flex justify-between items-start gap-10">
            <div className="relative w-full flex flex-col ml-5">
            <div className="grid grid-cols-3 md:flex-row md:flex-col gap-4 space-y-3">
            <div className="w-[36%] h-[57%] rounded-[20px] bg-secondary border-4 border-button-primary drop-shadow-[10px_10px_6px_rgba(0,0,0,0.25)] flex flex-col items-center justify-center mt-[7%] ml-[45%]">
                <div style={{backgroundImage: `url(${profile})`}} className="w-[90px] h-[90px] bg-no-repeat rounded-full object-cover bg-size-[auto_180px] bg-[right_-45px_top_-45px] -mt-60">
                <div className="text-[340%] text-[#AFAEA9] text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] mt-22">2</div>
                <div className="text-[200%] text-button-primary text-center justify-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] -ml-7">Username</div>
                <div className="text-[200%] text-button-primary text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">ELO</div>
                </div>
            </div>
            <div style={{backgroundImage: `url(${winner})`}} className="w-[524px] h-[524px] bg-cover bg-no-repeat flex flex-col items-center justify-center ml-[3%]">
                <div style={{backgroundImage: `url(${profile})`}} className="w-[120px] h-[120px] bg-no-repeat rounded-full object-cover bg-size-[auto_240px] bg-[right_-60px_top_-60px] -mt-30"></div>
                <div className="text-[370%] text-[#B39A48] text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] -mt-2">1</div>
                <div className="text-[220%] text-button-primary text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] mb-1">Username</div>
                <div className="text-[200%] text-button-primary text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">ELO</div>
            </div>
            <div className="w-[36%] h-[57%] rounded-[20px] bg-secondary border-4 border-button-primary drop-shadow-[-10px_10px_6px_rgba(0,0,0,0.25)] flex flex-col items-center justify-center mt-[7%] -ml-[45%]">
                <div style={{backgroundImage: `url(${profile})`}} className="w-[90px] h-[90px] bg-no-repeat rounded-full object-cover bg-size-[auto_180px] bg-[right_-45px_top_-45px] -mt-12"></div>
                <div className="text-[340%] text-[#B36548] text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">3</div>
                <div className="text-[200%] text-button-primary text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">Username</div>
                <div className="text-[200%] text-button-primary text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">ELO</div>
            </div>
            <div className="w-[36%] h-[94%] rounded-[20px] bg-secondary border-4 border-button-primary drop-shadow-[10px_10px_6px_rgba(0,0,0,0.25)]">
                <div style={{backgroundImage: `url(${profile})`}} className="mt-[1%] -ml-[1%] w-[60px] h-[60px] bg-no-repeat rounded-full object-cover bg-size-[auto_120px] bg-[right_-30px_top_-30px]"></div>
                <div className="-mt-[30%] -ml-[30%] text-[320%] text-button-primary text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">4</div>
                <div className="-mt-[27%] ml-[50%] text-[120%] text-button-primary text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">Username</div>
                <div className="-mt-[2%] ml-[74%] text-[120%] text-button-primary text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">ELO</div>
            </div>
            <div className="w-[36%] h-[94%] rounded-[20px] bg-secondary border-4 border-button-primary drop-shadow-[-10px_10px_6px_rgba(0,0,0,0.25)]">
                <div style={{backgroundImage: `url(${profile})`}} className="mt-[1%] -ml-[1%] w-[60px] h-[60px] bg-no-repeat rounded-full object-cover bg-size-[auto_120px] bg-[right_-30px_top_-30px]"></div>
                <div className="-mt-[28%] -ml-[30%] text-[48px] text-button-primary text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">5</div>
                <div className="-mt-[27%] ml-[50%] text-[20px] text-button-primary text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">Username</div>
                <div className="ml-[74%] -mt-[2%] text-[21px] text-button-primary text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">ELO</div>
            </div>
            </div>
{            //////////////////////////////////////////////////////////////////
}            
            {/* <div style={{backgroundImage: `url(${light})`}} className="absolute -top-35 -left-5 w-[1100px] h-[1000px] bg-no-repeat bg-cover bg-center bg-size-[auto_1000px]"></div> */}
            <div className="">
            <div style={{backgroundImage: `url(${background})`}} className="w-[935px] h-[350px] rounded-[20px] bg-no-repeat bg-cover bg-center bg-size-[auto_700px]">
                <div className="grid grid-rows-5 gap-1 items-end">
                    <div className="mt-4.25 ml-8 h-[47px] w-[870px] rounded-[20px] bg-blend-normal bg-secondary backdrop-blur-lg">
                        <div style={{backgroundImage: `url(${profile})`}} className="mt-0.75 w-[42px] h-[42px] bg-no-repeat rounded-full object-cover bg-size-[auto_85px] bg-[right_-21.5px_top_-21.5px]"></div>
                        <div className="-ml-110 -mt-10 text-[24px] text-button-primary text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">Username</div>
                        <div className="ml-75 -mt-9 text-[24px] text-button-primary text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">ELO</div>
                        <div className="ml-190 -mt-10.5 text-[32px] text-button-primary text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">6</div>
                    </div>
                    <div className="mt-4 ml-8 h-[47px] w-[870px] rounded-[20px] bg-blend-normal bg-secondary backdrop-blur-lg">
                        <div style={{backgroundImage: `url(${profile})`}} className="mt-0.5 w-[42px] h-[42px] bg-no-repeat rounded-full object-cover bg-size-[auto_85px] bg-[right_-21.5px_top_-21.5px]"></div>
                        <div className="-ml-110 -mt-10 text-[24px] text-button-primary text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">Username</div>
                        <div className="ml-75 -mt-9 text-[24px] text-button-primary text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">ELO</div>
                        <div className="ml-190 -mt-10.5 text-[32px] text-button-primary text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">7</div>
                    </div>
                    <div className="mt-4 ml-8 h-[47px] w-[870px] rounded-[20px] bg-blend-normal bg-secondary backdrop-blur-lg">
                        <div style={{backgroundImage: `url(${profile})`}} className="mt-0.5 w-[42px] h-[42px] bg-no-repeat rounded-full object-cover bg-size-[auto_85px] bg-[right_-21.5px_top_-21.5px]"></div>
                        <div className="-ml-110 -mt-10 text-[24px] text-button-primary text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">Username</div>
                        <div className="ml-75 -mt-9 text-[24px] text-button-primary text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">ELO</div>
                        <div className="ml-190 -mt-10.5 text-[32px] text-button-primary text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">8</div>
                    </div>
                    <div className="mt-4 ml-8 h-[47px] w-[870px] rounded-[20px] bg-blend-normal bg-secondary backdrop-blur-lg">
                        <div style={{backgroundImage: `url(${profile})`}} className="mt-0.5 w-[42px] h-[42px] bg-no-repeat rounded-full object-cover bg-size-[auto_85px] bg-[right_-21.5px_top_-21.5px]"></div>
                        <div className="-ml-110 -mt-10 text-[24px] text-button-primary text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">Username</div>
                        <div className="ml-75 -mt-9 text-[24px] text-button-primary text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">ELO</div>
                        <div className="ml-190 -mt-10.5 text-[32px] text-button-primary text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">9</div>
                    </div>
                    <div className="mt-4 ml-8 h-[47px] w-[870px] rounded-[20px] bg-blend-normal bg-secondary backdrop-blur-lg">
                        <div style={{backgroundImage: `url(${profile})`}} className="mt-0.75 w-[42px] h-[42px] bg-no-repeat rounded-full object-cover bg-size-[auto_85px] bg-[right_-21.5px_top_-21.5px]"></div>
                        <div className="-ml-110 -mt-10 text-[24px] text-button-primary text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">Username</div>
                        <div className="ml-75 -mt-9 text-[24px] text-button-primary text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">ELO</div>
                        <div className="ml-190 -mt-10.5 text-[32px] text-button-primary text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">10</div>
                    </div>
                </div>
            </div>
            </div>
            </div>
            {/* <div style={{backgroundImage: `url(${planet})`}} className="w-[500px] h-[500px] bg-no-repeat object-cover bg-size-[auto_450px] bg-[right_-160px_top_-5px] mr-20">
            <div className="mt-130 text-[60px] text-[#F9A4B9] text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">League</div>
            </div> */}
        </div>
    </div>
    );
}

export default Leaderboard;
