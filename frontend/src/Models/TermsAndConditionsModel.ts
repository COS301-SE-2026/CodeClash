export interface Terms {
    title: string;
    desc?: string;
    bullets?: string[];
}

//!!THIS IS BEING COPIED FROM A TXT DOCUMENT THAT WAS MADE AND CHECKED BEFORE IMPLEMENTATION STARTED
export const terms: Terms[] = [
    {
        title: '1. Acceptance of Terms',
        desc: 'By creating an account or using CodeClash, you agree to these Terms and Conditions. If you do not agree, do not use the platform.'
    },
    {
        title: '2. User Accounts',
        desc: 'Users are responsible for maintaining the confidentiality of their account credentials, and all information provided when registering must be accurate.'
    },
    {
        title: '3. Fair Play',
        desc: 'To ensure a fair experience, users agree not to:',
        bullets: [
            'Cheat or exploit bugs.',
            'Share answers during live matches.',
            'Attempt to manipulate rankings or ELO.'
        ],
    },
    {
        title: '4. Matchmaking and Rankings',
        bullets: [
            'CodeClash uses an ELO-based ranking system.',
            "Rankings are subject to change after every competitive 'Ranked Play' match.",
            'Matchmaking is based on player availability and similar ELO score.',
            'The platform does not guarantee equal waiting time.'
        ],
    },
    {
        title: '5. Educational Content',
        desc: 'Questions are provided for educational purposes. While every effort is made to ensure correctness, the platform does not guarantee that all problems or solutions are free from error.'
    },
    {
        title: '6. User Conduct',
        desc: 'Users must:',
        bullets: [
            'Avoid offensive usernames or content.',
            'Refrain from attempting to disrupt the platform.'
        ],
    },
    {
        title: '7. Availability',
        desc: 'CodeClash may occasionally be unavailable due to interruptions beyond the control of our team.'
    },
    {
        title: '8. Privacy',
        desc: 'CodeClash stores only the information necessary to provide its services. Personal information will not be shared without the permission of the user unless required by law.'
    },
    {
        title: '9. Intellectual Property',
        desc: 'All CodeClash original content remain the property of the CodeClash development team and may not be copied, distributed, or modified without permission.'
    },
    {
        title: '10. Limitation of Liability',
        desc: 'The development team is not liable for:',
        bullets: [
            'Data loss.',
            'Downtime.',
            'Lost rankings.',
            'Technical issues.',
            'Any indirect damages from using the platform.',
        ],
    },
    {
        title: '11. Changes to the Terms',
        desc: 'These Terms and Conditions may be updated at any time. Continued used after these changes are made indicates acceptance to the updated Terms and Conditions.'
    },
    {
        title: '12. Contact',
        desc: 'Questions regarding these Terms and Conditions may be directed to quantdevs@gmail.com.'
    },
]