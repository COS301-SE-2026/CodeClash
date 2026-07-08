type Topic = 'math' | 'prog';

export interface PopupProps {
    isOpen: boolean;
    onClose: () => void;
}


export const TOPICS = [
    {
        topic: 'math' as Topic,
        label: 'Math',
        icon: '+ -',
        colour: ''
    },
    {
        topic: 'prog' as Topic,
        label: 'Programming',
        icon: '</>'
    },
];
