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

export interface PlayerProgress {
    label: string;
    progress: number;
    color: string;
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
        title: 'Math History',
        desc: 'Review every match, your speed, accuracy and ELO impact.',
    },
    {
        icon: 'globe',
        title: 'Leaderboard',
        desc: 'See where you stand globally and among your league.',
    },
]

export const players: PlayerProgress[] = [
    {
        label: 'You',
        progress: 75,
        color: '#c0395a',
    },
    {
        label: 'Opponent',
        progress: 60,
        color: '#850F3b',
    },
]

export const audience: string[] = [
    "Computer science students aiming to imporve thier techincal skills",
    "Mathematics studnets who want to benchmark their speed",
    "Competitive programmers looking for daily match practice",
    "Anyone who wants to learn match and programming",
]