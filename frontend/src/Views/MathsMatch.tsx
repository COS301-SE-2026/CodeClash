import MathMatch from '@/components/features/MathPage';
import { Question } from '@/components/features/question';
import { MatchScreen } from '@/components/shared/Match';
import { Button } from '@/components/ui/button';
import { useMatch } from 'src/ViewModels/MatchViewModel';

const Match = () => {
    const {
        player_life, avatars, usernames,
        seconds, minutes, questions,
        current_question, progress
    } = useMatch();

    const curr = questions[current_question];

    return (
        <MatchScreen
            player_life={player_life}
            colour='var(--life-primary)'
            seconds={seconds}
            minutes={minutes}
            avatars={avatars}
            usernames={usernames}
            user_progress={progress.player_progress[0]}
            opponent_progres={progress.player_progress[1]}
            question_number={4}
        >
            <div className=''>
                <Question
                    className=''
                    difficulty={curr.difficulty}
                    title={curr.title}
                    question={curr.question}
                    description={curr.description}
                    number={curr.number}
                >
                    <MathMatch></MathMatch>
                </Question>
            </div>

            <div className=' flex items-center justify-center'>
                <Button className='w-[20%] h-[2.6rem] rounded-2xl text-[2rem]'>SUBMIT</Button>
            </div>
        </MatchScreen>
    )

}

export default Match;