export interface Help {
    title: string;
    desc: string;
    icon: "book" | "help" | "graduation" |"info";
    link?: string;
    comingSoon?:boolean; 
}

export const help: Help[] = [
    {
        title: 'Game Guide',
        desc: 'Learn about game modes, matchmaking, scoring, ELO rankings, and badges.',
        icon: 'book',
        link: "/game-guide",
    },
    {
        title: 'Frequently Asked Questions',
        desc: 'Find answers to the most commone questions about CodeClash.',
        icon: "help",
    },
    {
        title: 'Tutorials',
        desc: 'Step-by-step walkthroughs to help you master CodeClash.',
        icon: 'graduation',
    },
    {
        title: 'About CodeClash',
        desc: 'Learn about the platform, its vision and competitive learning.',
        icon: 'info',
    },
]