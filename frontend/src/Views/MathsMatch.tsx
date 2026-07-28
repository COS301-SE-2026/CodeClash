import MathMatch from '@/components/features/MathPage';
import { Question } from '@/components/features/question';
import Loading from '@/components/shared/Loading';
import { MatchScreen } from '@/components/shared/Match';
import { Button } from '@/components/ui/button';
import { useMatch } from 'src/ViewModels/MatchViewModel';

const MathsMatch = () => {
    const {
        playerLife, avatars, usernames,
        seconds, minutes, questions,
        currentQuestion, progress,
        nextQuestion, prevQuestion,
        loading, closeLoading
    } = useMatch();


    const curr = questions[currentQuestion];

    if(loading || !curr){
        return (
            <Loading isOpen={loading} onClose={closeLoading}></Loading>
        )
    }

    return (
        <MatchScreen
            player_life={playerLife}
            colour='var(--life-primary)'
            seconds={seconds}
            minutes={minutes}
            avatars={avatars}
            usernames={usernames}
            current_question={currentQuestion}
            opponent_progress={progress.player_progress[1]}
            question_number={4}
        >
            <div className=''>
                <Question
                    className=''
                    difficulty={curr.difficulty!}
                    title={curr.title!}
                    description={curr.description}
                    number={currentQuestion + 1}
                >
                    <MathMatch></MathMatch>
                </Question>
            </div>

            <div className='absolute w-[70%]  flex flex-shrink-0 items-center justify-center gap-[4rem]'>
                <Button className='w-[20%] h-[2.6rem] rounded-2xl text-[2rem]'
                    onClick={() => nextQuestion(currentQuestion)}    // need to attach marking logic once submission systems are implemented
                >SUBMIT</Button>

                {currentQuestion > 0 && (
                    <Button className='w-[20%] h-[2.6rem] rounded-2xl text-[2rem] bg-primary text-secondary'
                        onClick={() => prevQuestion(currentQuestion)}
                    >PREV</Button>
                )}
            </div>
        </MatchScreen>
    )

}

export default MathsMatch;