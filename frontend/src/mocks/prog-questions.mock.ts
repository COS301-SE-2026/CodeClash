
import type { QuestionDTO} from "../types/question.dto";

export const mock_questions: QuestionDTO[] = [
    {
        id:'1',
        title:'Array Sum',
        question: 'What will be the output of this code?',
        description: `const arr = [1, 2, 3, 4, 5];\nconst sum = arr.reduce((a, b) => a+b, 0);\nconsole.log(sum);\n`,
        difficulty: 'medium',
        language: 'Java',
    },
    {
        id:'2',
        title:'Reverse String',
        question: 'Write a function to reverse a string.',
        difficulty: 'medium',
        language: 'Java'
    }
]