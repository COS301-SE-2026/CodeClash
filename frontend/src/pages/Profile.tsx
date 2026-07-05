import React from 'react';
import profile from '../assets/Icons/profile_black.png'

interface ProfileProps {
  userName?: string;
  email?: string;
  playerLevel?: string;
  currentRank?: number;
  winStreak?: number;
  onBack?: () => void;
  onLogout?: () => void;
  onEdit?: () => void;
}

const Profile: React.FC<ProfileProps> = ({
  userName = 'User Name',
  email = 'user@codeclash.com',
  playerLevel = 'Level 32 - Mercury',
  currentRank = 522,
  winStreak = 63,
  onBack,
  onLogout,
}) => {
  return (
    <div className="relative w-full min-h-[1024px] bg-secondary mx-auto flex flex-col items-center justify-center">

      <div className="absolute top-[59px] left-[125px] w-[150px] h-[50px] text-secondary-text font-semibold text-[32px] rounded-[35px] text-center flex items-center justify-center cursor-pointer hover:bg-[#ecd0db48] transition-colors" 
      onClick={onBack} 
      tabIndex={0}
      onKeyDown={(e) => {
        const shift = e.shiftKey;
        if(shift && e.key === 'Esc'){
          onBack?.();
        }
      }}>
        ← Back
      </div>

      <div className="w-[558px] bg-secondary rounded-[20px] px-10 py-12 flex flex-col items-center gap-5 drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">

        <div className="w-[86px] h-[86px] rounded-full bg-no-repeat" style={{backgroundImage: `url(${profile})`, backgroundSize: '200% 200%', backgroundPosition: '-43px -43px'}} />

        <div className="text-secondary-text font-bold text-[40px] text-center">{userName}</div>
        <div className="text-secondary-text font-medium text-[24px] -mt-1">{playerLevel}</div>
        <div className="text-secondary-text font-normal text-[24px] text-center mt-[15px]">Current Streak - {winStreak}</div>
        <div className="text-secondary-text font-normal text-[24px] text-center underline mt-5 cursor-pointer">Game Guide</div>
        <div className="text-secondary-text font-normal text-[24px] text-center underline cursor-pointer">Settings</div>

        <div className="grid grid-flow-col grid-cols-2 gap-4 ml-8 mr-8 mt-15 h-20">
        <button
          className="w-full h-[60px] bg-button-primary text-white rounded-[20px] text-[24px] font-semibold flex items-center justify-center mt-2 cursor-pointer drop-shadow-[4px_4px_5px_rgba(0,0,0,0.3)] transition-all duration-200 hover:bg-primary hover:-translate-y-px active:translate-y-0 active:bg-[#1d4ed8]"
          type="button"
          onClick={onLogout}
          tabIndex={0}
          onKeyDown={(e) => {
            const ctrlOrCmd = e.ctrlKey || e.metaKey;
            if(ctrlOrCmd && e.key === 'Esc'){
              onLogout?.();
            }
          }
        }
        >
          Log Out
        </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;