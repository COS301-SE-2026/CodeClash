import { AnswerDTO } from "src/entities/dtos/answer.dto";
import { MathsMarker } from "./maths-marker";
import { equivalent, normalize, safeParse, splitTopLevel } from "./normalizer";

// relatively simple only marks csv


export class SetMarker implements MathsMarker {
  mark(submission: string, answer: AnswerDTO): boolean {
    const sub_parts = splitTopLevel(normalize(submission), ",")
    const ans_parts = splitTopLevel(normalize(answer.answer), ",")

    if (sub_parts.length !== ans_parts.length) return false

    const sub_nodes = sub_parts.map((part) => safeParse(part))
    if (sub_nodes.some((node) => node === null)) return false;
    
    const ans_nodes = ans_parts.map((part) => safeParse(part))
    if (ans_nodes.some((node) => node === null)) return false;

    const matched = new Array<boolean>(ans_nodes.length).fill(false)

    for (const sub_node of sub_nodes) {
      const index = ans_nodes.findIndex(
        (ans_node, position) => !matched[position] && equivalent(sub_node!, ans_node!)
      );

      if (index === -1) return false;
      matched[index] = true;
    }
    return true;
  }
}