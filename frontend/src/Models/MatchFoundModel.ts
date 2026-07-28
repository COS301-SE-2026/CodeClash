export interface MatchFoundPlayer {
  id: string;
  username: string;
  elo: number;
  side: 'left' | 'right';
}

export interface MatchFoundContent {
    title: string;
    matchupLabel: string;
    declineLabel: string;
    acceptLabel: string;
  }

  export interface MatchFoundDetail {
    label: string;
    value: string;
  }

  export const matchFoundContent: MatchFoundContent = {
    title: 'Opponent Found!',
    matchupLabel: 'VS',
    declineLabel: 'Decline Match',
    acceptLabel: 'Accept Match',
  };

  export const mockMatchFoundPlayers: MatchFoundPlayer[] = [
    {
      id: 'current-user',
      username: 'User 1',
      elo: 1222,
      side: 'left',
    },
    {
      id: 'matched-opponent',
      username: 'User 2',
      elo: 1500,
      side: 'right',
    },
  ];

  export const mockMatchFoundDetails: MatchFoundDetail[] = [
    {
      label: 'Match Type',
      value: 'Programming',
    },
    {
      label: 'Difficulty',
      value: 'Medium',
    },
  ];