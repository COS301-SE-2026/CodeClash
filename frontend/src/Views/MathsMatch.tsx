import MathMatch from '@/components/features/MathPage';
import { Question } from '@/components/features/question';
import { MatchScreen } from '@/components/shared/Match';
import { Button } from '@/components/ui/button';
import { useMatch } from 'src/ViewModels/MatchViewModel';

const Match = () => {
    const {
        player_life, avatars, usernames,
        seconds, minutes, questions,
        current_question, progress,
        nextQuestion, prevQuestion
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
            current_question={current_question}
            opponent_progress={progress.player_progress[1]}
            question_number={4}
        >
            <div className=''>
                <Question
                    className=''
                    difficulty={curr.difficulty}
                    title={curr.title}
                    question={curr.question}
                    description={curr.description}
                    number={current_question + 1}
                >
                    <MathMatch></MathMatch>
                </Question>
            </div>

            <div className='flex items-center justify-center gap-[4rem]'>
                <Button className='w-[20%] h-[2.6rem] rounded-2xl text-[2rem]'
                    onClick={() => nextQuestion(current_question)}    // need to attach marking logic once submission systems are implemented
                >SUBMIT</Button>

                {current_question > 0 && (
                    <Button className='w-[20%] h-[2.6rem] rounded-2xl text-[2rem] bg-primary text-secondary'
                        onClick={() => prevQuestion(current_question)}
                    >PREV</Button>
                )}
            </div>
        </MatchScreen>
    )

}

export default Match;