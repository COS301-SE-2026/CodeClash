// import { ChevronRight, ChevronLeft } from 'lucide-react'
import { useEffect } from 'react';
import { useMatch } from 'src/ViewModels/Match/MatchViewModel';

// import MathMatch from '@/components/features/MathPage';
// import { Question } from '@/components/features/question';
import Loading from '@/components/shared/Loading';
// import { MatchScreen } from '@/components/shared/Match/Match';
// import { Button } from '@/components/ui/button';
// import Popup from '@/components/shared/PopUp';

const MathsMatch = () => {
    const {
        status,
        currentQuestion,
        loading
    } = useMatch();

   // const curr = questions[currentQuestion];
    // const correct = results[currentQuestion];
    // const result_colour = () => {
    //     if (correct === true) return 'bg-success/50'
    //     else if (correct === false) return 'bg-danger/50'
    //     else return 'bg-white'
    // }


    // const read_only = () => {
    //     if (gameOver) return 'read-only'
    //     else return ''
    // }

    useEffect(() => {
        // if (mathfieldRef.current) {
        //     mathfieldRef.current.value = answers?.[currentQuestion] ?? ''
        // }
    }, [currentQuestion])


    if (status !== 'ready') {
        return (
            <Loading isOpen={loading}></Loading>
        )
    }

    // return (
    //     <MatchScreen

    //     >

    //         <Question
    //             className={` h-[20rem] `}
    //             difficulty={curr.difficulty!}
    //             title={curr.title!}
    //             description={curr.description}
    //             number={currentQuestion + 1}
    //         />

    //         <div className='w-[100%] h-[100%] min-h-[35%] flex items-center justify-center'>
    //             <MathMatch
    //                 mathfieldRef={mathfieldRef}
    //             // onValueChange={(val) => setAnswers(prev => ({ ...prev, [currentQuestion]: val }))}
    //             // className={`${result_colour()},${read_only}`}
    //             ></MathMatch>
    //         </div>
    //         <div className='w-[100%] h-[6rem]  flex flex-shrink-0 items-center justify-evenly rounded-4xl'>

    //             <div className='flex items-center justify-evenly text-secondary bg-primary rounded-2xl w-[15%]'>
    //                 <ChevronLeft onClick={() => prevQuestion(currentQuestion)} className='size-[3rem] hover:scale-110  hover:bg-secondary/20 rounded-2xl w-[50%]' />
    //                 <ChevronRight onClick={() => nextQuestion(currentQuestion)} className='size-[3rem] hover:scale-110 hover:bg-secondary/20 rounded-2xl w-[50%]' />
    //             </div>
    //             <Button className='w-[20%] h-[2.6rem] rounded-2xl text-[2rem] hover:-translate-y-1'
    //                 onClick={() => {
    //                     // const answer = mathfieldRef.current?.value ?? '';
    //                     // submitQuestion(curr.id!, 'math', { answer: answer })
    //                 }}
    //             >
    //                 SUBMIT
    //             </Button>
    //             {currentQuestion === (questions.length - 1) &&
    //                 <Button className='w-[20%] h-[2.6rem] rounded-2xl text-[2rem] hover:-translate-y-1'
    //                     onClick={() => {
    //                         finishGame();
    //                     }}
    //                 >
    //                     <p>FINISH</p>
    //                 </Button>
    //             }
    //         </div>

    //         {waitingOpponent && (
    //             <Popup

    //                 isOpen={waitingOpponent}
    //                 title={'Waiting For Opponent To Finish'}
    //                 subtitle={'Hang on while your opponent finishes up'}
    //             />
    //         )

    //         }
    //     </MatchScreen>
    // )

}

export default MathsMatch;