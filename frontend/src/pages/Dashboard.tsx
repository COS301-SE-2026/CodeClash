import React from 'react';
import './Dashboard.css';
import logoImage from '../assets/LightMode_Logo.png';
import dashboardIcon from '../assets/Dashboard_Icon.png'
import friendsIcon from '../assets/Friends_Icon.png'
import leaderboardIcon from '../assets/Leaderboard_Icon.png'
import tournamentsIcon from '../assets/Tournaments_Icon.png'
import badgesIcon from '../assets/Badges_Icon.png'
import gameguideIcon from '../assets/GameGuide_Icon.png'
import settingsIcon from '../assets/Settings_Icon.png'
import profileIcon from '../assets/Profile_Icon.png'
import rankedplayImage from '../assets/RankedPlay_Image.png'
import casualplayImage from '../assets/CasualPlay_Image.png'
import medalImage from '../assets/RecentlyEarned_Image.png'
import agentIcon from '../assets/AIAgent_Icon.png'
import notificationIcon from '../assets/Notification_Icon.png'

import PopUp from '../components/PopUp';

type NavPage =
  | 'Dashboard'
  | 'Friends'
  | 'Leaderboard'
  | 'Tournaments'
  | 'Badges'
  | 'Game Guide'
  | 'Settings';

interface DashboardProps {
  userName?:       string;
  xpPercent?:      number;
  currentRank?:    number;
  rankTopPercent?: number;
  winStreak?:      number;
  personalBest?:   number;
  onNavChange?:    (page: NavPage) => void;
  onCasualPlay?:   () => void;
  onRankedPlay?:   (topic: 'math' | 'programming') => void;
  onAllSkills?:    () => void;
  onAllBadges?:    () => void;
  onProfileClick?: () => void;
}

const NAV_ITEMS: { page: NavPage; icon: any; alt: string }[] = [
  { page: 'Dashboard',   icon: dashboardIcon, alt: 'Dashboard' },
  { page: 'Friends',     icon:friendsIcon, alt: 'Friends' },
  { page: 'Leaderboard', icon: leaderboardIcon, alt: 'Leaderboard' },
  { page: 'Tournaments', icon: tournamentsIcon, alt: 'Tournaments'},
  { page: 'Badges',      icon: badgesIcon, alt: 'Badges' },
  { page: 'Game Guide',  icon: gameguideIcon, alt: 'Game Guide' },
  { page: 'Settings',    icon: settingsIcon, alt: 'Settings' },
];

const SKILLS = [
  { name: 'Arrays & Strings',      level: 6, progress: 6 },
  { name: 'Integrals & Derivates', level: 3, progress: 3 },
];

const MATCHES = [
  { date: '20/05/2026', opponent: 'JohnDoe',    topic: 'Programming', speed: '03:00', result: 'Win'  as const, elo:  450 },
  { date: '15/04/2026', opponent: 'AverySmith', topic: 'Math',        speed: '04:39', result: 'Win'  as const, elo:  200 },
  { date: '20/05/2026', opponent: 'HexaKnight', topic: 'Math',        speed: '06:47', result: 'Win'  as const, elo:  200 },
  { date: '20/05/2026', opponent: 'NovaSpark',  topic: 'Programming', speed: '05:05', result: 'Lose' as const, elo: -200 },
];

const BADGES = [
  { name: 'Speed Demon',  icon: medalImage},
  { name: 'Math Wiz',     icon: medalImage},
  { name: '5 Day Streak', icon: medalImage},
];

const Dashboard: React.FC<DashboardProps> = ({
  userName        = 'User Name',
  onNavChange,
  onCasualPlay,
  onRankedPlay,
  onAllSkills,
  onAllBadges,
  onProfileClick,
}) => {
  const [activePage,     setActivePage]     = React.useState<NavPage>('Dashboard');
  const [showTopicPopup, setShowTopicPopup] = React.useState(false);
  const [collapsed,      setCollapsed]      = React.useState(false);

  React.useEffect(() => {
    const scale = () => {
      const el = document.querySelector('.dashboard-page') as HTMLElement;
      if (!el) return;
      const s = Math.min(window.innerWidth / 1440, window.innerHeight / 1024);
      el.style.transform = `scale(${s})`;
      el.style.left      = `${(window.innerWidth  - 1440 * s) / 2}px`;
      el.style.top       = `${(window.innerHeight - 1024 * s) / 2}px`;
    };
    scale();
    window.addEventListener('resize', scale);
    return () => window.removeEventListener('resize', scale);
  }, []);

  return (
    <div className={`dashboard-page${collapsed ? ' collapsed' : ''}`}>

      <PopUp
        isOpen={showTopicPopup}
        onClose={() => setShowTopicPopup(false)}
        onSelectTopic={(topic) => { setShowTopicPopup(false); onRankedPlay?.(topic); }}
      />

      <aside className="sidebar">
        <div className="sidebar-top">
          <img src={logoImage} alt="CodeClash" className="sidebar-logo" />
          <button
            className="collapse-btn"
            type="button"
            onClick={() => setCollapsed(c => !c)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M11 3.5L5.5 9L11 14.5" stroke="white" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map(({ page, icon }) => (
            <button
              key={page}
              type="button"
              className={`nav-item${activePage === page ? ' active' : ''}`}
              onClick={() => { setActivePage(page); onNavChange?.(page); }}
              title={collapsed ? page : undefined}
            >
              <span className="nav-icon-placeholder">
                <img src={icon} alt={`${page} icon`} className="nav-icon-img" />
              </span>
              <span className="nav-label">{page}</span>
            </button>
          ))}
        </nav>

        <div
          className="sidebar-profile"
          role="button"
          tabIndex={0}
          onClick={onProfileClick}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onProfileClick?.(); }}
        >
          <img src={profileIcon} alt="Profile" className="profile-circle" /> 
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{userName}</div>
            <div className="sidebar-user-level">Intermediate Player</div>
          </div>
        </div>
      </aside>

      <header className="header">
        <input className="header-search" type="text" placeholder="Search..." aria-label="Search" />
        <div className="header-spacer" />
        <div className="header-icons">
          <button className="header-icon-btn" type="button" aria-label="Notifications">
            <img src={notificationIcon} width="20" height="20" alt="" />
          </button>
          <button className="header-icon-btn" type="button" aria-label="Account">
            <img src={agentIcon} width="20" height="20" alt="" />
          </button>
        </div>
      </header>

      <main className="dashboard-content">

        <div className="play-cards-row">

          <div className="play-card">
            <div className="play-card-text">
              <div className="play-card-title">Casual Play</div>
              <div className="play-card-desc">Practice your skills without affecting your rank</div>
            </div>
            <img src={casualplayImage} alt="" className="play-card-image" /> 
            <button className="play-now-button" type="button" onClick={onCasualPlay}>
              Play Now &gt;
            </button>
          </div>

          <div className="play-card">
            <div className="play-card-text">
              <div className="play-card-title">Ranked Play</div>
              <div className="play-card-desc">Compete for glory and climb the leaderboard</div>
            </div>
            <img src={rankedplayImage} alt="" className="play-card-image" />
            <button className="play-now-button" type="button" onClick={() => setShowTopicPopup(true)}>
              Play Now &gt;
            </button>
          </div>
        </div>

        <div className="mid-row">

          <div className="skill-progress-card">
            <div className="skill-progress-header">
              <span className="skill-progress-title">Skills Progress</span>
              <button className="all-skills-button" type="button" onClick={onAllSkills}>
                All Skills &gt;
              </button>
            </div>
            <div className="skills-body">
              {SKILLS.map((skill) => (
                <div className="skill-row" key={skill.name}>
                  <div className="skill-label-row">
                    <span className="skill-name">{skill.name}</span>
                    <span className="skill-level-badge">LV {skill.level}</span>
                  </div>
                  <div className="skill-bar-track">
                    <div className="skill-bar-fill"
                         style={{ width: `${(skill.progress / 10) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="recently-earned-card">
            <div className="recently-earned-header">
              <span className="recently-earned-title">Recently Earned</span>
              <button className="all-badges-btn" type="button" onClick={onAllBadges}>
                All Badges &gt;
              </button>
            </div>
            <div className="badges-row">
              {BADGES.map((badge) => (
                <div className="badge-item" key={badge.name}>
                  <img src={badge.icon} alt={badge.name} className="badge-image" /> 
                  <div className="badge-name">{badge.name}</div>
                </div>
              ))}
            </div>
          </div>

        </div>

        <div className="history-row">
          <div className="match-history-card">
            <div className="match-history-title">Match History</div>
            <table className="match-table">
              <colgroup>
                <col style={{ width: '17%' }} />
                <col style={{ width: '19%' }} />
                <col style={{ width: '19%' }} />
                <col style={{ width: '15%' }} />
                <col style={{ width: '15%' }} />
                <col style={{ width: '20%' }} />
              </colgroup>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Opponent</th>
                  <th>Topic</th>
                  <th>Speed</th>
                  <th>Result</th>
                  <th>Effect on Elo</th>
                </tr>
              </thead>
              <tbody>
                {MATCHES.map((m, i) => (
                  <tr key={i}>
                    <td>{m.date}</td>
                    <td>{m.opponent}</td>
                    <td>{m.topic}</td>
                    <td>{m.speed}</td>
                    <td style={{ color: m.result === 'Win' ? '#16213D' : '#16213d', fontWeight: m.result === 'Win' ? 800 : 600 }}>
                      {m.result}
                    </td>
                    <td style={{ color: m.elo >= 0 ? '#22c55e' : '#ef4444', fontWeight: 800 }}>
                      {m.elo >= 0 ? '+' : ''}{m.elo}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
};

export default Dashboard;