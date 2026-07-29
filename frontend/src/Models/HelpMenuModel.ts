export interface Help {
    title: string;
    desc: string;
    icon: "book" | "help" | "graduation" |"info";
    link?: string;
}

export interface FAQ {
    question: string;
    answer: string;
}

export interface Contact {
    heading: string;
    desc: string;
    email: string;
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

export const faqs: FAQ[] = [
    {
        question: 'How do I start a match?',
        answer: 'Choose Raked Play on the dashboard, and select Programming or Mathematics. You will be entered into the matchmaking queue and the match will begin once an opponent is found'
    },
    {
        question: 'How is my score calculated?',
        answer: 'Scores are determined using both corrections and completion time for each question. Faster, correct answers earn more points.'
    },
    {
        question: 'What is ELO?',
        answer: 'Elo is a competitive rating that increases as you win matches, and decreases if you lose a match.'
    },
    {
        question: 'How do I practice before starting a match?',
        answer: 'Casual play is designed for practice and does not affect your competitive ELO rating.'
    }, 
    {
        question: 'Can I see previously played matches?',
        answer: "'Match History' is accessible from the dashboard sidebar, and can be used to review previous matches, scores, and performance statistics"
    }
]

export const contact: Contact = {
    heading: 'Contact Our Support Team',
    desc: "Can't find what you're looking for? Contact our support team.",
    email: 'quantdevs@gmail.com' 
}