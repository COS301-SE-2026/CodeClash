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

export interface AchievementsContent {
    title: string;
    subtitle: string;
    earnedTitle: string;
    lockedTitle: string; //for the achievments that can be earned but arent yet, like kind of clickup style
    lockedHint: string; //just telling the user that they need to continue playing to unlock this achievement eg Zap in ranked, they need to play and win in a row
    progressLabel: string;
}

export const achievementContent: AchievementsContent = {
    title: 'Achievements', //badges or achievements? need to confirm wording
    subtitle: 'Earned Achievements and yet to Unlock',
    earnedTitle: 'Earned',
    lockedTitle: 'Locked',
    lockedHint: 'Keep playing to unlock',
    progressLabel: 'unlocked'
}