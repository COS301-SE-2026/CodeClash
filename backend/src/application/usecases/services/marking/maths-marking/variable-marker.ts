import { MathNode } from "mathjs";

import { AnswerDTO } from "src/entities/dtos/answer.dto";

import { MathsMarker } from "./maths-marker";
import { equivalent, normalize, safeParse, splitTopLevel } from "./normalizer";

const ASSIGNMENT_NAME = /^[a-z][a-z0-9]*$/;

export class VariableMarker implements MathsMarker {
  mark(submission: string, answer: AnswerDTO): boolean {
    const sub_values = this.parseAssignments(submission);
    if (sub_values === null) return false;

    const ans_values = this.parseAssignments(answer.answer);
    if (ans_values === null) return false;

    if (sub_values.size !== ans_values.size) return false;

    for (const [name, ans_node] of ans_values) {
      const sub_node = sub_values.get(name);
      if(sub_node === undefined) return false;
      if (!equivalent(sub_node, ans_node)) return false;
    }

    return true;
  }

  private parseAssignments(str: string): Map<string, MathNode> | null {
    const parts = splitTopLevel(normalize(str), ",");
    if (parts.length === 0) return null;

    const values = new Map<string, MathNode>();
    for (const part of parts) {
      const sides = splitTopLevel(part, "=");
      if (sides.length !== 2) return null;
      const name = sides[0]!.trim().toLowerCase();
      if (!ASSIGNMENT_NAME.test(name)) return null;

      const value = safeParse(sides[1]!);
      if (value === null) return null;

      if (values.has(name)) return null;
      values.set(name, value);

    }

    return values;
  }
}
