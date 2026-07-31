// import background from '../assets/Background/leaderboard_background.png';
import profile from '../assets/Icons/Profile.png';
import winner from '../assets/Icons/winner.png';
import planet from '../assets/Planets/Earth.png';
import GlassCard from '@/components/shared/GlassCard';
import bg from '../assets/Background/stary-image-part-two.jpeg'
import { LeaderboardViewModel } from '../ViewModels/LeaderboardViewModel';

import '../styles/global.css';
import {Link} from 'react-router-dom';

import light from '../assets/light.png';


const Leaderboard = () => {
  const { userData, topThree, isLoadingData, error, page, totalPages, nextPage, prevPage } = LeaderboardViewModel('earth');

  if (isLoadingData) return <div className="text-white">Loading...</div>;
  if (error) return <div className="text-white">Error: {error}</div>;

  const placeholder = { username: '-', elo: 0, avatarUrl: '' };
  // const user = (index: number) => topTen[index] || {username: '-', elo: 0, avatarUrl: ''} ;
  const user = (index: number) => topThree[index] || placeholder;
  const displayedRows = page === 1 ? userData.slice(3) : userData;

  return (
    <div style={{backgroundImage: `url(${bg})`}} className="w-full min-h-screen bg-cover bg-no-repeat object-cover">
            <Link to="/dashboard" className="text-primary font-[var(--font)] text-[32px] font-semibold ml-5">← Back</Link>
            <h1 className="text-[60px] text-secondary text-center -mt-1 font-[var(--font)] font-semibold drop-shadow-[4px_4px_0px_rgba(0,0,0,0.25)]">Leader Board</h1>

            <div className="relative flex justify-center items-start gap-10 ">
                <div className="relative w-2/3 flex flex-col gap-6 ">
                  <div className="flex justify-center items-end gap-5 ">
                    <div className="w-[239px] h-[304px] rounded-[20px] bg-white/10 backdrop-blur-xl border-4 border-secondary drop-shadow-[10px_10px_6px_rgba(0,0,0,0.25)] flex flex-col items-center justify-center">
              {/*<div style={{backgroundImage: `url(${profile})`}} className="w-[90px] h-[90px] bg-no-repeat rounded-full bg-size-[auto_180px] bg-center -mt-10"></div>*/}
                    
                        <div className="text-[64px] text-muted-text text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">2</div>
                        <div className="text-[32px]  text-button-primary text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{user(0).username}</div>
                        <div className="text-[32px]  text-button-primary text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{user(0).elo}</div>
                    </div>
                    <div className="w-[320px] h-[400px] rounded-[20px] bg-white/10 backdrop-blur-xl border-4 border-secondary drop-shadow-[0px_10px_6px_rgba(0,0,0,0.25)] flex flex-col items-center justify-center">

                        {/*<div style={{backgroundImage: `url(${profile})`}} className="w-[120px] h-[120px] bg-no-repeat rounded-full bg-white/10 backdrop-blur-xl bg-size-[auto_240px] bg-[right_-60px_top_-60px] -mt-20"></div>*/}
                        <div className="text-[64px]  text-primary-text text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">1</div>
                        <div className="text-[32px]  text-button-primary text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{user(1).username}</div>
                        <div className="text-[32px]  text-button-primary text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{user(1).elo}</div>
                    </div>
                    <div className="w-[239px] h-[304px] rounded-[20px] bg-white/10 backdrop-blur-xl border-4 border-secondary drop-shadow-[-10px_10px_6px_rgba(0,0,0,0.25)] flex flex-col items-center justify-center">
                        {/*<div style={{backgroundImage: `url(${profile})`}} className="w-[90px] h-[90px] bg-no-repeat rounded-full bg-size-[auto_180px] bg-center -mt-10"></div>*/}
                        <div className="text-[64px] text-[#B36548] text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">3</div>
                        <div className="text-[32px]  text-button-primary text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{user(2).username}</div>
                        <div className="text-[32px]  text-button-primary text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{user(2).elo}</div>
                    </div>
                  </div>

                  <div className="relative mt-8">
                    {/*<div style={{backgroundImage: `url(${light})`}} className="absolute -top-20 -left-5 w-[1100px] h-[1000px] bg-no-repeat bg-cover bg-center bg-size-[auto_1000px] -z-10"></div>*/}
                    <div className="relative w-full min-h-[200px] rounded-[20px]">
                        {/*<div style={{backgroundImage: `url(${background})`}} className="absolute inset-0 rounded-[20px] bg-no-repeat bg-cover bg-center bg-size-[auto_700px]"></div>*/}
                        <div className="relative rounded-[20px] bg-white/10 backdrop-blur-xl pt-3 pb-4 border border-white/20">
                        <div className="px-4 mt-3 h-[24px] flex items-center text-[14px]  text-secondary font-bold tracking-wider">
                            <div className="w-[42px] shrink-0"></div>
                            <span className="flex-1 ml-6">NAME</span>
                            <span className="mr-20">ELO</span>
                            <span className="mr-4">RANK</span>
                        </div>
                        <div className="flex flex-col gap-1 items-center mt-4">
                            {displayedRows.map((row, idx) => {
                                const rank = page === 1 ? idx + 4 : (page - 1) * 10 + idx + 1;
                                return (
                                <div key={rank} className="h-[47px] w-[90%] rounded-[20px] bg-secondary backdrop-blur-lg flex items-center px-4 border border-white/10">
                                    {/*<div style={{backgroundImage: `url(${profile})`}} className="w-[42px] h-[42px] bg-no-repeat rounded-full bg-size-[auto_85px] bg-[right_-21.5px_top_-21.5px] shrink-0"></div>*/}
                                    <div className="flex-1 text-[24px]  text-button-primary font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] ml-6">{row.username}</div>
                                    <div className="text-[24px]  text-button-primary font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] mr-20">{row.elo}</div>
                                    <div className="text-[32px]  text-button-primary font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] mr-4">{rank}</div>
                                </div>
                                );
                            })}
                        </div>
                        </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-6 mt-2">
                    <button onClick={prevPage} disabled={page <= 1} className="px-5 py-2 rounded-[10px] bg-button-primary text-primary font-semibold text-[20px] disabled:opacity-40 hover:bg-[#F4A0B2] transition-colors">← Prev</button>
                    <div className="flex items-center gap-2">
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        const start = Math.max(1, page - 2);
                        const p = start + i;
                        if (p > totalPages) return null;
                        return (
                          <button key={p} onClick={() => setPage(p)} className={`w-[40px] h-[40px] rounded-full text-[20px] font-semibold transition-colors ${p === page ? 'bg-button-primary text-primary' : 'text-secondary hover:bg-[#F4A0B2]/30'}`}>{p}</button>
                        );
                      })}
                    </div>
                    <button onClick={nextPage} disabled={page >= totalPages} className="px-5 py-2 rounded-[10px] bg-button-primary text-primary font-semibold text-[20px] disabled:opacity-40 hover:bg-[#F4A0B2] transition-colors">Next →</button>
                  </div>
                </div>

                <div className="absolute right-0 top-40 flex flex-col items-center">
                    <div style={{backgroundImage: `url(${planet})`}} className="w-[300px] h-[300px] bg-no-repeat bg-contain bg-center"></div>
                    <div className="text-[60px] text-secondary text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">League</div>
                </div>
            </div>
      </div>
      );
}




export default Leaderboard;

// testing husky stuff
