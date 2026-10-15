import {MatchmakingUserDTO} from '../../src/entities/dtos/matchmaking/matchmaking.dto';
import { randomUUID } from 'node:crypto';
import { MatchMode, MatchType } from '../../src/entities/dtos/matches/match.dto';


export const mock_user = {
    user_id: '',
    cognito_id: 'cognito-user-id',
    username: 'integration_test_user',
    email: 'integration01@test.com',
    avatar_id: 0,
    league: "Mercury",
    current_streal: 0,
    winning_streak: 0
}


export const mock_users_array = [
    {
        cognito_id: 'cognito-user-id_01',
        username: 'integration_test_user_01',
        email: 'integration01@test.com',
        avatar_id: 0,
        league: "Mercury",
        current_streal: 0,
        winning_streak: 0
    },
     {
        cognito_id: 'cognito-user-id_02',
        username: 'integration_test_user_02',
        email: 'integration02@test.com',
        avatar_id: 0,
        league: "Mercury",
        current_streal: 0,
        winning_streak: 0
    },
     {
        cognito_id: 'cognito-user-id_03',
        username: 'integration_test_user_03',
        email: 'integration01@test.com',
        avatar_id: 0,
        league: "Mercury",
        current_streal: 0,
        winning_streak: 0
    },

]

export const ranked_maths_users: MatchmakingUserDTO[] = [
    {
        id: randomUUID(),
        elo: 600,
        joined_at: new Date(),
        match_mode: MatchMode.Maths,
        match_type: MatchType.ranked,
        match_attempt: 1
    },
    {
        id: randomUUID(),
        elo: 650,
        joined_at: new Date(),
        match_mode: MatchMode.Maths,
        match_type: MatchType.ranked,
        match_attempt: 1
    },
    {
        id: randomUUID(),
        elo: 800,
        joined_at: new Date(),
        match_mode: MatchMode.Maths,
        match_type: MatchType.ranked,
        match_attempt: 1
    }
]

export const ranked_prog_users: MatchmakingUserDTO[] = [
    {
        id: randomUUID(),
        elo: 600,
        joined_at: new Date(),
        match_mode: MatchMode.Programming,
        match_type: MatchType.ranked,
        match_attempt: 1
    },
    {
        id: randomUUID(),
        elo: 650,
        joined_at: new Date(),
        match_mode: MatchMode.Programming,
        match_type: MatchType.ranked,
        match_attempt: 1
    },
    {
        id: randomUUID(),
        elo: 800,
        joined_at: new Date(),
        match_mode: MatchMode.Programming,
        match_type: MatchType.ranked,
        match_attempt: 1
    }
]


export const casual_maths_users: MatchmakingUserDTO[] = [
    {
        id: randomUUID(),
        elo: 600,
        joined_at: new Date(),
        match_mode: MatchMode.Maths,
        match_type: MatchType.casual,
        match_attempt: 1
    },
    {
        id: randomUUID(),
        elo: 650,
        joined_at: new Date(),
        match_mode: MatchMode.Maths,
        match_type: MatchType.casual,
        match_attempt: 1
    },
    {
        id: randomUUID(),
        elo: 800,
        joined_at: new Date(),
        match_mode: MatchMode.Maths,
        match_type: MatchType.casual,
        match_attempt: 1
    }
]

export const casual_prog_users: MatchmakingUserDTO[] = [
    {
        id: randomUUID(),
        elo: 600,
        joined_at: new Date(),
        match_mode: MatchMode.Programming,
        match_type: MatchType.casual,
        match_attempt: 1
    },
    {
        id: randomUUID(),
        elo: 650,
        joined_at: new Date(),
        match_mode: MatchMode.Programming,
        match_type: MatchType.casual,
        match_attempt: 1
    },
    {
        id: randomUUID(),
        elo: 800,
        joined_at: new Date(),
        match_mode: MatchMode.Programming,
        match_type: MatchType.casual,
        match_attempt: 1
    }
]
