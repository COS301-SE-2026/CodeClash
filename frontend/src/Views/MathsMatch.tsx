import MathMatch from '@/components/features/MathPage';
import { Question } from '@/components/features/question';
import Loading from '@/components/shared/Loading';
import { MatchScreen } from '@/components/shared/Match';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { useMatch } from 'src/ViewModels/MatchViewModel';


const MathsMatch = () => {
    const {
        playerLife, avatars, usernames,
        seconds, minutes, questions,
        currentQuestion, progress,
        nextQuestion, prevQuestion,
        loading, closeLoading, submitQuestion,
        mathfieldRef, setAnswers, answers, 
        results
    } = useMatch();

    const curr = questions[currentQuestion];
  //  console.log(playerLife)

    useEffect(() => {
        if (mathfieldRef.current) {
            mathfieldRef.current.value = answers![currentQuestion] ?? ''
        }
    }, [currentQuestion])


    if (loading || !curr) {
        return (
            <Loading isOpen={loading} onClose={closeLoading}></Loading>
        )
    }

    const correct = results[currentQuestion];


    const result_colour = () => {
        if (correct === true) return 'bg-success/50'
        else if (correct === false) return 'bg-danger/50'
        else return 'bg-white'
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
            question_number={questions.length}
            question_results={results}
        >

            <Question
                className={` h-[20rem] `}
                difficulty={curr.difficulty!}
                title={curr.title!}
                description={curr.description}
                number={currentQuestion + 1}
            />

            <div className='w-[100%] h-[100%] min-h-[35%] flex items-center justify-center'>
                <MathMatch
                    mathfieldRef={mathfieldRef}
                    onValueChange={(val) => setAnswers(prev => ({ ...prev, [currentQuestion]: val }))}
                    className={`${result_colour}`}
                ></MathMatch>
            </div>
            <div className='w-[100%] h-[6rem]  flex flex-shrink-0 items-center justify-evenly rounded-4xl'>
                <Button className='w-[20%] h-[2.6rem] rounded-2xl text-[2rem]'
                    onClick={() => {
                        const answer = mathfieldRef.current?.value ?? '';
                        submitQuestion(curr.id!, answer)
                        nextQuestion(currentQuestion)
                    }}    // need to attach marking logic once submission systems are implemented
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