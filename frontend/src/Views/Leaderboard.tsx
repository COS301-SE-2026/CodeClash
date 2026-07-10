import profile from '../assets/Icons/Profile.png'
import shadow from '../assets/shadow.png'
import winner from '../assets/Icons/winner.png'
import planet from '../assets/Planets/Earth.png'
import background from '../assets/Background/leaderboard_background.png'
import '../styles/global.css'
import {Link} from 'react-router-dom'
import { type LeaderboardProps } from 'src/Models/LeaderboardModel';
import { LeaderboardUserData } from 'src/Models/LeaderboardModel'


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
    <div className="w-full min-h-screen bg-[#C0395A]">
    <div className="w-2/3 min-h-screen bg-[#C0395A] flex justify-start">
    <div>
        <h1 className="text-[64px] text-[#FFDBE4] font-heading font-heading-weight drop-shadow-[4px_4px_0px_rgba(0,0,0,0.25)] ">Leader Board</h1>
    </div>
    </div>
    </div>
    );
}

export default Leaderboard;
