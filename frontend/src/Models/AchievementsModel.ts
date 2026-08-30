/*What achievements i added:
Trophy - First of each leagues
Flame - For streaks achievement, maybe 5 days, 10 days etc
Zap - For winning continuous ranked matches, maybe 3 or 5 in a row
Medal - For casual, completing a section or a language?
*/

export type Icons = 'trophy' | 'flame' | 'zap' | 'medal';

export interface Achievements {
    id: string;
    name: string;
    description: string;
    icon: Icons;
}

export interface Earned {
    id: string;
    earnedAt: string; //ISO timestamp so user can see when exactly they earned an achievement badge
}