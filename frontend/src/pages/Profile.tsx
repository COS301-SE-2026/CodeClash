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
    <div className="profile-page">

      <div className="back-button" 
      onClick={onBack}>
        ← Back
      </div>

      <div className="profile-card">

        <div className="profile-avatar" />

        <div className="profile-name">{userName}</div>
        <div className="profile-level">{playerLevel}</div>
        <div className="profile-streak">Current Streak - {winStreak}</div>
        <div className="profile-gameguide">Game Guide</div>
        <


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