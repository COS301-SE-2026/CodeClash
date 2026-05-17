import React from 'react';
import './Dashboard.css';
import logoImage from '../assets/LightMode_Logo.png';
import trophyIcon from '../assets/Trophy_Icon.png';              
import streakIcon from '../assets/Streak_Icon.png';            
import badgeIcon from '../assets/Badge_Icon.png';    
import profileIcon from '../assets/Profile_Icon.png';   

type NavPage = 'Dashboard' | 'Friends' | 'Leaderboard' | 'Tournaments' | 'Badges' | 'Game Guide' | 'Settings';

interface DashboardProps {
  userName?: string;
  xpPercent?: number;           
  currentRank?: number;
  rankTopPercent?: number;
  winStreak?: number;
  personalBest?: number;
  badgeName?: string;
  onNavChange?: (page: NavPage) => void;
  onCasualPlay?: () => void;
  onRankedPlay?: () => void;
  onAllSkills?: () => void;
  onProfileClick?: () => void;
}

interface Skill {
  name: string;
  level: number;       
  progress: number;   
}

const skills: Skill[] = [
  { name: 'Arrays & Strings', level: 6, progress: 6 },
  { name: 'Integrals & Derivates', level: 3, progress: 3 },
  { name: 'Recursion', level: 5, progress: 8 },
];

const NAV_ITEMS: NavPage[] = [
  'Dashboard', 'Friends', 'Leaderboard', 'Tournaments', 'Badges', 'Game Guide', 'Settings',
];

const Dashboard: React.FC<DashboardProps> = ({
  userName = 'User Name',
  xpPercent = 60,
  currentRank = 522,
  rankTopPercent = 10,
  winStreak = 5,
  personalBest = 11,
  badgeName = 'SPEED DEMON',
  onNavChange,
  onCasualPlay,
  onRankedPlay,
  onAllSkills,
  onProfileClick
}) => {
  const [activePage, setActivePage] = React.useState<NavPage>('Dashboard');

  const handleNav = (page: NavPage) => {
    setActivePage(page);
    onNavChange?.(page);
  };

  return (
    <div className="dashboard-page">
      <header className="header">
        <img src={logoImage} alt="CodeClash logo" className="header-logo" />
        <h1 className="header-title">CodeClash</h1>
        <div className="header-user">
        <div className="profile-row">
            <img
            src={profileIcon}
            alt="Profile"
            className="profile-circle"
            onClick={onProfileClick}
            />
            <div className="user-details">
            <span className="user-name">{userName}</span>
            <div className="xp-bar-wrapper">
                <div className="xp-bar-fill" style={{ width: `${xpPercent}%` }} />
            </div>
            <span className="player-level">Intermediate Player</span>
            </div>
        </div>
        </div>
      </header>

      <nav className="navbar">
        {NAV_ITEMS.map((item) => (
          <button
            key={item}
            className={`nav-item${activePage === item ? ' active' : ''}`}
            onClick={() => handleNav(item)}
            type="button"
          >
            {item}
          </button>
        ))}
      </nav>

      <main className="dashboard-content">
        <div className="play-cards-row">
          <div className="play-card casual">
            <div>
              <div className="play-card-title">Casual Play</div>
              <div className="play-card-desc">Practice your skills without affecting your rank</div>
            </div>
            <button className="play-now-button" type="button" onClick={onCasualPlay}>
              Play Now &gt;
            </button>
          </div>

          <div className="play-card ranked">
            <div>
              <div className="play-card-title">Ranked Play</div>
              <div className="play-card-desc">Compete for glory and climb the leaderboard</div>
            </div>
            <button className="play-now-button" type="button" onClick={onRankedPlay}>
              Play Now &gt;
            </button>
          </div>
        </div>

        <div className="bottom-row">
          <div className="stat-cards-col">
            <div className="stat-card">
              <img src={trophyIcon} alt="Rank" className="stat-icon" />
              <div className="stat-value">#{currentRank}</div>
              <div className="stat-label">Current Rank</div>
              <div className="stat-sub">Top {rankTopPercent}%</div>
            </div>

            <div className="stat-card">
              <img src={streakIcon} alt="Win Streak" className="stat-icon" />
              <div className="stat-value">{winStreak}</div>
              <div className="stat-label">Win Streak</div>
              <div className="stat-sub">Personal best: {personalBest}</div>
            </div>
          </div>

          <div className="skill-progress-card">
            <div className="skill-progress-header">
              <span className="skill-progress-title">Skill Progress</span>
              <button className="all-skills-button" type="button" onClick={onAllSkills}>
                All Skills &gt;
              </button>
            </div>

            {skills.map((skill) => (
              <div className="skill-row" key={skill.name}>
                <div className="skill-label-row">
                  <span className="skill-name">{skill.name}</span>
                  <span className="skill-level-badge">LV {skill.level}</span>
                </div>
                <div className="skill-bar-track">
                  <div
                    className="skill-bar-fill"
                    style={{ width: `${(skill.progress / 10) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="recently-earned-card">
            <div className="recently-earned-title">Recently Earned</div>
            <img src={badgeIcon} alt={badgeName} className="badge-image" />
            <div className="badge-name">{badgeName}</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;