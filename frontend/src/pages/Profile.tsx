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
  playerLevel = 'Intermediate Player',
  currentRank = 522,
  winStreak = 5,
  onBack,
  onLogout,
}) => {
  return (
    <div className="profile-page">

      <button className="back-button" onClick={onBack} type="button">
        ← Back
      </button>

      <div className="profile-card">

        <div className="profile-avatar" />

        <div className="profile-name">{userName}</div>
        <div className="profile-email">{email}</div>
        <div className="profile-level">{playerLevel}</div>

        <div className="profile-divider" />

        <div className="profile-info-row">
          <span className="profile-info-label">Current Rank</span>
          <span className="profile-info-value">#{currentRank}</span>
        </div>

        <div className="profile-info-row">
          <span className="profile-info-label">Win Streak</span>
          <span className="profile-info-value">{winStreak}</span>
        </div>

        <div className="profile-divider" />

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