export interface MatchSearchingPlayer {
  id: string;
  username: string;
  elo: number;
  side: 'left' | 'right';
}

export interface MatchSearchingContent {
  title: string;
  matchupLabel: string;
  cancelLabel: string;
}

export const matchSearchingContent: MatchSearchingContent = {
  title: 'Searching for a match...',
  matchupLabel: 'VS',
  cancelLabel: 'Cancel Queue',
}

export const mockMatchSearchingPlayer: MatchSearchingPlayer[] = [
  {
    id: 'current-user',
    username: 'User 1',
    elo: 1222,
    side: 'left',
  },
  {
    id: 'queued-opponent',
    username: 'User 2',
    elo: 1200,
    side: 'right',
  },
];

export function formatMatchSearchTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds .toString().padStart(2, '0')}`;
}
