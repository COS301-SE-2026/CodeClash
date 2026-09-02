export interface Stat {
    value: string;
    label: string;
}

export interface Step {
    step: string;
    icon: "rocket" | "swords" | "trophy";
    title: string;
    desc: string;
}

export interface Feature {
    icon: "calculator" | "code" | "chart" | "medal" | "history" | "globe";
    title: string;
    desc: string;
}

export interface Docs {
    title: string;
    desc: string;
    icon: "palette" | "book" | "help";
    link: string;
}

export const stats: Stat[] = [
    {
        value: '1v1',
        label: 'Real-time battles',
    },
    {
        value: '2',
        label: 'Game modes',
    },
    {
        value: 'ELO',
        label: 'Ranked system',
    },
    {
        value: 'Infinite',
        label: 'Problems to solve',
    }
]

export const steps:Step[] = [
    {
        step: '01',
        icon: 'rocket',
        title: 'Choose your battle',
        desc: 'Pick between modes Casual or Ranked.',
    },
    {
        step: '02',
        icon: 'swords',
        title: 'Compete Live',
        desc: 'Solve problems faster and more accurately than your opponent. Watch their progress in real-time. Submit answers before they do.',
    },
    {
        step: '03',
        icon: 'trophy',
        title: 'Climb the Ranks',
        desc: 'Your ELO updates after every match. Earn nadges, trcak your history, and rise through the leaderboard.',
    }
]

export const features: Feature[] = [
    {
        icon: 'calculator',
        title: 'Math Battles',
        desc: 'Timed arithmetic, algebraic and calculus challenges against a live opponent.',
    },
    {
        icon: 'code',
        title: 'Code Duels',
        desc: 'Solve programming problems with speed and accuracy.',
    },
    {
        icon: 'chart',
        title: 'ELO Ranking',
        desc: 'A fair skill-based rating system. Win and climb. Lose and learn.',
    },
    {
        icon: 'medal',
        title: 'Badges',
        desc: 'Earn achievements for milestones, winning streaks and special challenges.',
    },
    {
        icon: 'history',
        title: 'Match History',
        desc: 'Review every match, your speed, accuracy and ELO impact.',
    },
    {
        icon: 'globe',
        title: 'Leaderboard',
        desc: 'See where you stand globally and among your league.',
    },
]

export const audience: string[] = [
    "Computer science students aiming to improve their technical skills",
    "Mathematics students who want to benchmark their speed",
    "Competitive programmers looking for daily match practice",
    "Anyone who wants to learn math and programming",
]

export const docs: Docs[] = [
    {
        title: 'Brand Style Guide',
        desc: 'Explore the CodeClash brand identity, including colors, typography, logos, icons and visual design guidelines.',
        icon: 'palette',
        link: '/brand-style-guide',
    },
    {
        title: 'Game Guide',
        desc: 'Learn about game modes, matchmaking, scoring, ELO rankings, badges and everything you need to before entering the CodeClashe Arena.',
        icon: 'book',
        link: '/game-guide',
    },
    {
        title: 'Help Menu',
        desc: 'Find answers to common questions, and learn how to use every part of CodeClash',
        icon: 'help',
        link: '/help-menu',
    },
]