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
        value: 'Infinity',
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
        step: '02',
        icon: 'trophy',
        title: 'CLimb the Ranks',
        desc: 'Your ELO updates after every match. Earn nadges, trcak your history, and rise through the leaderboard.',
    }
]