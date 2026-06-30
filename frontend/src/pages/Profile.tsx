import React from 'react';
import './Profile.css';

interface ProfileProps {
  userName?: string;
  email?: string;
  playerLevel?: string;
  currentRank?: number;
  winStreak?: number;
  onBack?: () => void;
  onLogout?: () => void;
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

      <div className="absolute top-[59px] left-[125px] w-[150px] h-[50px] text-secondary-text font-semibold text-32px rounded-[35px] text-center flex items-center justify-center cursor-pointer hover:bg-[#ecd0db48] transition-colors" 
      onClick={onBack}>
        ← Back
      </div>

      <div className="w-[558px] bg-secondary rounded-[20px] px-10 py-12 flex flex-col items-center gap-5 drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">

        <div className="profile-avatar" />

        <div className="profile-name">{userName}</div>
        <div className="profile-level">{playerLevel}</div>
        <div className="profile-streak">Current Streak - {winStreak}</div>
        <div className="profile-gameguide">Game Guide</div>
        <div className="profile-settings">Settings</div>


        <button
          className="logout-button"
          type="button"
          onClick={onLogout}
        >
          Log Out
        </button>

      </div>
    </div>
  );
};

export default Profile;