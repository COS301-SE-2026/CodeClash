import { AnswerDTO } from "src/entities/dtos/answer.dto";

import { MathsMarker } from "./maths-marker";
import { closeAbsolute, evaluateConstant, safeParse, toleranceFor } from "./normalizer";

export class NumericMarker implements MathsMarker {
    mark(submission: string, answer: AnswerDTO): boolean {
        const parsed_snode = safeParse(submission);
        if (parsed_snode === null) return false;

        const parsed_svalue = evaluateConstant(parsed_snode);
        if (parsed_svalue === null) return false;


      const parsed_expectednode = safeParse(answer.answer);
        const parsed_expectedvalue = parsed_expectednode === null ? null : evaluateConstant(parsed_expectednode);
      if (parsed_expectedvalue === null) return false;

        return closeAbsolute(parsed_svalue, parsed_expectedvalue, toleranceFor(answer.precision));
    }
}
