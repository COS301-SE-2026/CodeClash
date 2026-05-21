import React from "react";
import logoImage from "../assets/LightMode_Logo.png";
import dashboardIcon from "../assets/Dashboard_Icon.png";
import friendsIcon from "../assets/Friends_Icon.png";
import leaderboardIcon from "../assets/Leaderboard_Icon.png";
import tournamentsIcon from "../assets/Tournaments_Icon.png";
import badgesIcon from "../assets/Badges_Icon.png";
import gameguideIcon from "../assets/GameGuide_Icon.png";
import settingsIcon from "../assets/Settings_Icon.png";
import profileIcon from "../assets/Profile_Icon.png";
import rankedplayImage from "../assets/RankedPlay_Image.png";
import casualplayImage from "../assets/CasualPlay_Image.png";
import medalImage from "../assets/RecentlyEarned_Image.png";
import agentIcon from "../assets/AIAgent_Icon.png";
import notificationIcon from "../assets/Notification_Icon.png";
import searchIcon from "../assets/Search_Icon.png";

<<<<<<< HEAD
import PopUp from "@/components/shared/PopUp";
=======
import PopUp from '@/components/shared/PopUp';
>>>>>>> 8599d94c6a78eb3ea7157076a3cae264f666a608

type NavPage =
  | "Dashboard"
  | "Friends"
  | "Leaderboard"
  | "Tournaments"
  | "Badges"
  | "Game Guide"
  | "Settings";

interface DashboardProps {
  userName?: string;
  xpPercent?: number;
  currentRank?: number;
  rankTopPercent?: number;
  winStreak?: number;
  personalBest?: number;
  onNavChange?: (page: NavPage) => void;
  onCasualPlay?: () => void;
  onRankedPlay?: (topic: "math" | "programming") => void;
  onAllSkills?: () => void;
  onAllBadges?: () => void;
  onProfileClick?: () => void;
}

const NAV_ITEMS: { page: NavPage; icon: any; alt: string }[] = [
  { page: "Dashboard", icon: dashboardIcon, alt: "Dashboard" },
  { page: "Friends", icon: friendsIcon, alt: "Friends" },
  { page: "Leaderboard", icon: leaderboardIcon, alt: "Leaderboard" },
  { page: "Tournaments", icon: tournamentsIcon, alt: "Tournaments" },
  { page: "Badges", icon: badgesIcon, alt: "Badges" },
  { page: "Game Guide", icon: gameguideIcon, alt: "Game Guide" },
  { page: "Settings", icon: settingsIcon, alt: "Settings" },
];

const SKILLS = [
  { name: "Arrays & Strings", level: 6, progress: 6 },
  { name: "Integrals & Derivates", level: 3, progress: 3 },
];

const MATCHES = [
  {
    date: "20/05/2026",
    opponent: "JohnDoe",
    topic: "Programming",
    speed: "03:00",
    result: "Win" as const,
    elo: 450,
  },
  {
    date: "15/04/2026",
    opponent: "AverySmith",
    topic: "Math",
    speed: "04:39",
    result: "Win" as const,
    elo: 200,
  },
  {
    date: "20/05/2026",
    opponent: "HexaKnight",
    topic: "Math",
    speed: "06:47",
    result: "Win" as const,
    elo: 200,
  },
  {
    date: "20/05/2026",
    opponent: "NovaSpark",
    topic: "Programming",
    speed: "05:05",
    result: "Lose" as const,
    elo: -200,
  },
];

const BADGES = [
  { name: "Speed Demon", icon: medalImage },
  { name: "Math Wiz", icon: medalImage },
  { name: "5 Day Streak", icon: medalImage },
];

const Dashboard: React.FC<DashboardProps> = ({
  userName = "User Name",
  onNavChange,
  onCasualPlay,
  onRankedPlay,
  onAllSkills,
  onAllBadges,
  onProfileClick,
}) => {
  const [activePage, setActivePage] = React.useState<NavPage>("Dashboard");
  const [showTopicPopup, setShowTopicPopup] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#d2d2d2]">
      <PopUp
        isOpen={showTopicPopup}
        onClose={() => setShowTopicPopup(false)}
        onSelectTopic={(topic) => {
          setShowTopicPopup(false);
          onRankedPlay?.(topic);
        }}
      />

      <aside
        className={`${collapsed ? "w-[70px]" : "w-[246px]"} flex flex-col bg-[#5f5980] text-white transition-all duration-200 flex-shrink-0`}
      >
        <div className="flex items-center justify-between px-4 h-16 border-b border-white/12 flex-shrink-0">
          <img
            src={logoImage}
            alt="CodeClash"
            className="w-[34px] h-[34px] object-contain flex-shrink-0"
          />
          {!collapsed && (
            <span className="font-['Baloo_Bhai_2'] text-2xl font-[800] text-white whitespace-nowrap flex-1 overflow-hidden ml-[10px]">
              CodeClash
            </span>
          )}
          <button
            className="p-[5px] rounded-[7px] hover:bg-white/14 flex items-center justify-center flex-shrink-0 bg-transparent border-none cursor-pointer text-white"
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 18 18"
              fill="none"
              className={`transition-transform duration-200 ${collapsed ? "rotate-180" : ""}`}
            >
              <path
                d="M11 3.5L5.5 9L11 14.5"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col py-3 gap-[2px] flex-1 overflow-hidden">
          {NAV_ITEMS.map(({ page, icon }) => (
            <button
              key={page}
              type="button"
              className={`flex items-center gap-3 px-[18px] py-[11px] mx-2 font-['Baloo_Bhai_2'] text-base font-semibold text-white text-left whitespace-nowrap overflow-hidden rounded-[10px] transition-colors duration-200 ${activePage === page ? "bg-white/20 text-white" : "hover:bg-white/11 text-white"} ${collapsed ? "justify-center mx-0 px-0" : ""}`}
              onClick={() => {
                setActivePage(page);
                onNavChange?.(page);
              }}
              title={collapsed ? page : undefined}
            >
              <img
                src={icon}
                alt=""
                className="w-[22px] h-[22px] object-contain flex-shrink-0"
              />
              {!collapsed && (
                <span
                  className={`overflow-hidden transition-all duration-200 ${collapsed ? "max-w-0 opacity-0" : "max-w-[160px] opacity-100"}`}
                >
                  {page}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div
          className="flex items-center gap-[11px] px-[18px] py-4 border-t border-white/12 cursor-pointer overflow-hidden flex-shrink-0 hover:bg-white/10"
          role="button"
          tabIndex={0}
          onClick={onProfileClick}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") onProfileClick?.();
          }}
        >
          <img
            src={profileIcon}
            alt="Profile"
            className="w-[38px] h-[38px] rounded-full border-2 border-white/35 object-cover flex-shrink-0"
          />
          {!collapsed && (
            <div
              className={`overflow-hidden transition-all duration-200 ${collapsed ? "max-w-0 opacity-0" : "max-w-[160px] opacity-100"}`}
            >
              <div className="font-['Baloo_Bhai_2'] text-sm font-bold text-white leading-[1.2] truncate">
                {userName}
              </div>
              <div className="font-['Baloo_Bhai_2'] text-[11px] font-semibold text-white/55 truncate">
                Intermediate Player
              </div>
            </div>
          )}
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center px-[22px] h-16 bg-[#5f5980] gap-3">
          <div className="flex items-center gap-2 px-[15px] bg-white/14 rounded-[20px] w-[230px]">
            <img
              src={searchIcon}
              width="50"
              height="50"
              alt=""
              className="mix-blend-multiply"
            />
            <input
              className="flex-1 bg-transparent border-none py-2 px-[15px] outline-none font-['Baloo_Bhai_2'] text-sm text-white placeholder:text-white/30"
              type="text"
              placeholder="Search..."
              aria-label="Search"
            />
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <button
              className="flex items-center justify-center p-[7px] rounded-[8px] hover:bg-white/14 mix-blend-multiply"
              type="button"
              aria-label="Notifications"
            >
              <img src={notificationIcon} width="20" height="20" alt="" />
            </button>
            <button
              className="flex items-center justify-center p-[7px] rounded-[8px] hover:bg-white/14 mix-blend-multiply"
              type="button"
              aria-label="Account"
            >
              <img src={agentIcon} width="20" height="20" alt="" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="relative bg-white rounded-[20px] p-6 flex flex-col justify-between min-h-[260px] overflow-visible">
              <div className="flex-1 min-w-0">
                <div className="font-['Baloo_Bhai_2'] text-[40px] font-[800] text-[#16213d] leading-[1.1] mt-[50px]">
                  Casual Play
                </div>
                <div className="font-['Baloo_Bhai_2'] text-[20px] font-[500] text-[#16213d] mt-[30px] opacity-65">
                  Practice your skills without affecting your rank
                </div>
              </div>
              <img
                src={casualplayImage}
                alt=""
                className="absolute top-[-20px] right-[-10px] h-[160px] w-auto object-contain pointer-events-none mix-blend-multiply"
              />
              <button
                className="w-full h-14 bg-[#0e34a0] text-white border-none rounded-[20px] font-['Baloo_Bhai_2'] text-[20px] font-bold cursor-pointer transition-all duration-200 hover:bg-[#0a2880] hover:-translate-y-px active:translate-y-0 mt-4 [filter:drop-shadow(4px_4px_5px_rgba(0,0,0,0.3))]"
                type="button"
                onClick={onCasualPlay}
              >
                Play Now &gt;
              </button>
            </div>

            <div className="relative bg-white rounded-[20px] p-6 flex flex-col justify-between min-h-[260px] overflow-visible">
              <div className="flex-1 min-w-0">
                <div className="font-['Baloo_Bhai_2'] text-[40px] font-[800] text-[#16213d] leading-[1.1] mt-[50px]">
                  Ranked Play
                </div>
                <div className="font-['Baloo_Bhai_2'] text-[20px] font-[500] text-[#16213d] mt-[30px] opacity-65">
                  Compete for glory and climb the leaderboard
                </div>
              </div>
              <img
                src={rankedplayImage}
                alt=""
                className="absolute top-[-20px] right-[-10px] h-[160px] w-auto object-contain pointer-events-none mix-blend-multiply"
              />
              <button
                className="w-full h-14 bg-[#0e34a0] text-white border-none rounded-[20px] font-['Baloo_Bhai_2'] text-[20px] font-bold cursor-pointer transition-all duration-200 hover:bg-[#0a2880] hover:-translate-y-px active:translate-y-0 mt-4 [filter:drop-shadow(4px_4px_5px_rgba(0,0,0,0.3))]"
                type="button"
                onClick={() => setShowTopicPopup(true)}
              >
                Play Now &gt;
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 [filter:drop-shadow(4px_4px_5px_rgba(0,0,0,0.3))]">
            <div className="bg-white rounded-[20px] p-5 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between flex-shrink-0 mb-1">
                <span className="font-['Baloo_Bhai_2'] text-[32px] font-[800] text-[#16213d]">
                  Skills Progress
                </span>
                <button
                  className="bg-[#5f5980] text-white border-none rounded-[10px] px-[13px] py-[5px] font-['Baloo_Bhai_2'] text-xs font-bold cursor-pointer transition-colors duration-200 hover:bg-[#4a4470] [filter:drop-shadow(4px_4px_5px_rgba(0,0,0,0.3))]"
                  type="button"
                  onClick={onAllSkills}
                >
                  All Skills &gt;
                </button>
              </div>
              <div className="flex flex-col flex-1 justify-evenly min-h-0">
                {SKILLS.map((skill) => (
                  <div key={skill.name} className="flex flex-col gap-[6px]">
                    <div className="flex items-center justify-between">
                      <span className="font-['Baloo_Bhai_2'] text-sm font-bold text-[#16213d]">
                        {skill.name}
                      </span>
                      <span className="bg-[#4a4470] text-white font-['Baloo_Bhai_2'] text-[11px] font-[800] px-2 py-[2px] rounded-[6px] [filter:drop-shadow(4px_4px_5px_rgba(0,0,0,0.3))]">
                        LV {skill.level}
                      </span>
                    </div>
                    <div className="w-full h-[25px] bg-[#e0e0e0] rounded-[99px] overflow-hidden">
                      <div
                        className="h-full bg-[#16213D] rounded-[99px]"
                        style={{ width: `${(skill.progress / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-[20px] p-5 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between flex-shrink-0 mb-1">
                <span className="font-['Baloo_Bhai_2'] text-[32px] font-[800] text-[#16213d]">
                  Recently Earned
                </span>
                <button
                  className="bg-[#5f5980] text-white border-none rounded-[10px] px-[13px] py-[5px] font-['Baloo_Bhai_2'] text-xs font-bold cursor-pointer transition-colors duration-200 hover:bg-[#4a4470] [filter:drop-shadow(4px_4px_5px_rgba(0,0,0,0.3))]"
                  type="button"
                  onClick={onAllBadges}
                >
                  All Badges &gt;
                </button>
              </div>
              <div className="flex items-center justify-evenly flex-1">
                {BADGES.map((badge) => (
                  <div
                    key={badge.name}
                    className="flex flex-col items-center gap-[10px]"
                  >
                    <img
                      src={badge.icon}
                      alt={badge.name}
                      className="w-[112px] h-[112px] object-contain"
                    />
                    <div className="font-['Baloo_Bhai_2'] text-[12px] font-[800] text-[#16213d] text-center uppercase tracking-[0.04em]">
                      {badge.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[20px] p-5 flex flex-col overflow-hidden [filter:drop-shadow(4px_4px_5px_rgba(0,0,0,0.3))]">
            <div className="font-['Baloo_Bhai_2'] text-[32px] font-[800] text-[#16213d] flex-shrink-0 mb-2">
              Match History
            </div>
            <div className="overflow-x-auto flex-1">
              <table className="w-full border-collapse font-['Baloo_Bhai_2'] table-fixed">
                <colgroup>
                  <col style={{ width: "17%" }} />
                  <col style={{ width: "19%" }} />
                  <col style={{ width: "19%" }} />
                  <col style={{ width: "15%" }} />
                  <col style={{ width: "15%" }} />
                  <col style={{ width: "20%" }} />
                </colgroup>
                <thead>
                  <tr className="border-b-[1.5px] border-[#ebebeb]">
                    <th className="text-center py-2 px-[10px] pb-2 text-[12px] font-[800] text-[#16213d]/45 uppercase tracking-[0.05em]">
                      Date
                    </th>
                    <th className="text-center py-2 px-[10px] pb-2 text-[12px] font-[800] text-[#16213d]/45 uppercase tracking-[0.05em]">
                      Opponent
                    </th>
                    <th className="text-center py-2 px-[10px] pb-2 text-[12px] font-[800] text-[#16213d]/45 uppercase tracking-[0.05em]">
                      Topic
                    </th>
                    <th className="text-center py-2 px-[10px] pb-2 text-[12px] font-[800] text-[#16213d]/45 uppercase tracking-[0.05em]">
                      Speed
                    </th>
                    <th className="text-center py-2 px-[10px] pb-2 text-[12px] font-[800] text-[#16213d]/45 uppercase tracking-[0.05em]">
                      Result
                    </th>
                    <th className="text-center py-2 px-[10px] pb-2 text-[12px] font-[800] text-[#16213d]/45 uppercase tracking-[0.05em]">
                      Effect on Elo
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {MATCHES.map((m, i) => (
                    <tr
                      key={i}
                      className="h-[42px] border-b border-[#f3f3f3] last:border-none"
                    >
                      <td className="text-center px-[10px] text-sm font-semibold text-[#16213d]">
                        {m.date}
                      </td>
                      <td className="text-center px-[10px] text-sm font-semibold text-[#16213d]">
                        {m.opponent}
                      </td>
                      <td className="text-center px-[10px] text-sm font-semibold text-[#16213d]">
                        {m.topic}
                      </td>
                      <td className="text-center px-[10px] text-sm font-semibold text-[#16213d]">
                        {m.speed}
                      </td>
                      <td
                        className={`text-center px-[10px] text-sm font-[800] ${m.result === "Win" ? "text-green-600" : "text-red-600"}`}
                      >
                        {m.result}
                      </td>
                      <td
                        className={`text-center px-[10px] text-sm font-[800] ${m.elo >= 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {m.elo >= 0 ? "+" : ""}
                        {m.elo}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
