import type { ProgFeedbackDTO } from "src/dtos/match/submission.dto";

const COMPILATION_ERROR = 6; 

interface TestCaseFeedbackProps {
  feedback: ProgFeedbackDTO
}

export const TestCaseFeedback = ({ feedback }: TestCaseFeedbackProps) => {
  const compile_error = feedback.status_id === COMPILATION_ERROR;

  return (
         <div className='w-[95%] mx-auto mb-3 rounded-xl border border-danger/60 bg-danger/10 p-3 text-left text-[0.85rem]'>
             <p className='font-semibold text-danger'>
                 {compile_error ? feedback.verdict : `Test ${feedback.test_number} of ${feedback.total_tests}: ${feedback.verdict}`}
             </p>
 
             {!compile_error && (
                 <dl className='mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1'>
                     <FeedbackRow label='Input' value={feedback.input} />
                     <FeedbackRow label='Expected' value={feedback.expected_output} />
                     <FeedbackRow label='Your output' value={feedback.actual_output ?? '(no output)'} />
                 </dl>
             )}
 
             {feedback.error && (
                 <pre className='mt-2 max-h-40 overflow-auto whitespace-pre-wrap rounded-lg bg-black/30 p-2 font-mono text-[0.8rem]'>{feedback.error}</pre>
             )}
         </div>
     );
}

const FeedbackRow = ({ label, value }: { label: string, value: string }) => (
  <>
    <dt className='text-muted-text'>{label}</dt>
    <dd className='max-h-24 overflow-auto whitespace-pre-wrap break-all font-mono'>{value}</dd>
  </>
)