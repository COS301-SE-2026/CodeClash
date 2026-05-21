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
import rankedplayImage from '../assets/RankedPlay_Image.png'
import casualplayImage from '../assets/CasualPlay_Image.png'
import medalImage from '../assets/RecentlyEarned_Image.png'

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

