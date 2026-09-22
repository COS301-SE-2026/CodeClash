import type { RefObject } from "react";
import { QuestionInputType } from "src/dtos/match/match-question.dto";
import { MultipleChoiceInput } from "./multiple-choice-input";
import { SelectionInput } from "./selection-input";
import { ShortTextInput } from "./short-text-input";
import MathInput from "./math-input";

export interface AnswerInputProps {
    type: QuestionInputType,
    value: string;
    onChange: (value: string) => void,
    mathfieldRef?: RefObject<any>
}

export interface InputProps {
    value: string;
    onChange: (value: string) => void,
    mathfieldRef?: RefObject<any>
}

export const AnswerInput = ({
    type,
    value,
    onChange,
    mathfieldRef
}: AnswerInputProps) => {
    switch (type) {
        case QuestionInputType.multiple_choice:
            return (
                <MultipleChoiceInput
                    value={value}
                    onChange={onChange}
                />
            );

        case QuestionInputType.selection:
            return (
                <SelectionInput
                    value={value}
                    onChange={onChange}

                />
            );

        case QuestionInputType.short_text:
            return (
                <ShortTextInput
                    value={value}
                    onChange={onChange}
                />
            );

        case QuestionInputType.long_text:
            if (!mathfieldRef) return null;

            return (
                <MathInput
                    value={value}
                    onChange={onChange}
                    mathfieldRef={mathfieldRef}
                />
            );

        case QuestionInputType.code:
            // return (
            //     <CodeInput
            //         value={value}
            //         onChange={onChange}
            //     />
            // );

        default: return null;
    }
}