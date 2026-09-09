import { MathNode, rationalize } from "mathjs";

import { AnswerFormat } from "src/entities/db-entities/questions.entities";
import { AnswerDTO } from "src/entities/dtos/answer.dto";

import { MathsMarker } from "./maths-marker";
import { degreeOf, equivalent, factorsOf, safeParse, variablesIn } from "./normalizer";

// naming the shape of the answer in order to describe the wanted result, mathjs can return split numerator and denominator

type RationalD = {
  numerator: MathNode;
  denominator: MathNode | null;
}

// three separate ways of marking, expression, simplified, factored, technically all fall under expression, like, duhh

export class ExpressionMarker implements MathsMarker {
  mark(submitted: string, answer: AnswerDTO): boolean {
    const sub_node = safeParse(submitted);
    if (sub_node === null) return false;

    const expect_node = safeParse(answer.answer);
    if (expect_node === null) return false;

    if (!equivalent(sub_node, expect_node)) return false;

    if (answer.format === AnswerFormat.Simplified) {
      return this.isSimplified(submitted, answer.answer);
    }

    if (answer.format === AnswerFormat.Factored) {
      return this.isFactored(submitted, answer.answer);
    }

    return true;
  }

  // helper function for rationalizing parts for simplified answers
  // 
  private rationParts(source: string): {
    numerator: number,
    denominator: number,
  } | null {
    const node = safeParse(source);
    if (node === null) return null;

    try {
      const rational = rationalize(node, {}, true) as unknown as RationalD;
      const numerator = rational.numerator;
      const denominator = rational.denominator;
      return {
        numerator: degreeOf(numerator),
        denominator: denominator === null || denominator === undefined ? 0 : degreeOf(denominator)
      };
      
    } catch {
      return null;
    }
  }

  private isSimplified(submitted: string, answer: string): boolean {
    const sub_parts = this.rationParts(submitted);
    const ans_parts = this.rationParts(answer);
    if (sub_parts === null || ans_parts === null) return true; // not rational so no degree innit

    return sub_parts.numerator <= ans_parts.numerator && sub_parts.denominator <= ans_parts.denominator;
  }

  private isFactored(submitted: string, answer: string): boolean {
    const node = safeParse(submitted);
    if (node === null) return false;

    const factors = factorsOf(node);
    const vary = factors.filter((factor) => variablesIn(factor).length > 0);
    if (vary.length < 2) return false;
    return vary.every((factor) => degreeOf(factor) <= 1);
  }
}