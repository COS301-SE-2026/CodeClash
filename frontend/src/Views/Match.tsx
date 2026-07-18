import { MatchScreen } from '@/components/shared/Match';
import { useMatch } from 'src/ViewModels/MatchViewModel';



const Match = () => {

    const {player_life, avatars, seconds, minutes, usernames } = useMatch();

    console.log(avatars)
    console.log(usernames)
    return (
        <MatchScreen
            player_life={player_life}
            colour='var(--life-primary)'
            seconds={seconds}
            minutes={minutes}
            avatars={avatars}
            usernames={usernames}
        >

        </MatchScreen>
    )

}

export default Match;