import { MathNode, parse } from "mathjs";

import { AnswerDTO } from "src/entities/dtos/answer.dto";

import { MathsMarker } from "./maths-marker";
import { closeRelative, normalize, safeParse, splitTopLevel, variablesIn } from "./normalizer";

const SAMPLE_POINTS: number[][] = [
    [0.31, 1.7], [2.5, -3.1], [-4.2, 0.9], [1.13, 2.77], [-0.67, -1.41]
];
const MIN_AGREEMENTS = 3;

export class EquationMarker implements MathsMarker {
    mark(submission: string, answer: AnswerDTO): boolean {
      const sub_diff = this.asDifference(submission);
      if (sub_diff === null) return false;
      const ans_diff = this.asDifference(answer.answer);
      if (ans_diff === null) return false;

      return this.proportional(sub_diff, ans_diff); // applies proportionality through rations of sample points? 
    }

  private asDifference(source: string) : MathNode | null {
    const sides = splitTopLevel(normalize(source), "=") // grabs the equation
    if (sides.length !== 2) return null;

    const left = safeParse(sides[0]!);
    const right = safeParse(sides[1]!);
    if (left === null || right === null) return null;

    try {
       return parse(`(${left.toString()})-(${right.toString()})`);
    } catch {
      return null;
    }
  }

  private proportional(submitted: MathNode, answer: MathNode): boolean {
    const variables = variablesIn(submitted, answer);
    if (variables.length === 0) return false; // trivial

    let ratio: number | null = null; // let ration be some number or null
    let agreements = 0;

    for (const point of SAMPLE_POINTS) {
               const scope: Record<string, number> = {};
               variables.forEach((variable, index) => {
                   scope[variable] = point[index % point.length]!;
               });
   
               const submitted_value = this.valueAt(submitted, scope);
               const expected_value = this.valueAt(answer, scope);
               if (submitted_value === null || expected_value === null) continue;
   
               // Both vanish here, which is consistent with any ratio, so it proves nothing.
               if (Math.abs(expected_value) < 1e-9) {
                   if (Math.abs(submitted_value) >= 1e-9) return false;
                   continue;
               }
   
               const sample_ratio = submitted_value / expected_value;
               if (Math.abs(sample_ratio) < 1e-9) return false;
   
               if (ratio === null) ratio = sample_ratio;
               else if (!closeRelative(ratio, sample_ratio)) return false;
   
               agreements++;
    }

    return ratio !== null && agreements >= MIN_AGREEMENTS
    
  }

  private valueAt(node: MathNode, scope: Record<string, number>): number | null {
    try {
      const value: unknown = node.evaluate(scope);
      return typeof value === "number" && Number.isFinite(value) ? value : null;
    } catch {
      return null;
    }
  }
}
