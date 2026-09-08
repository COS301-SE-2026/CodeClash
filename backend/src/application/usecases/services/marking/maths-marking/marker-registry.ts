import { AnswerFormat } from "src/entities/db-entities/questions.entities";

import { EquationMarker } from "./equation-marker";
import { ExpressionMarker } from "./expression-marker";
import { MathsMarker } from "./maths-marker";
import { NumericMarker } from "./numeric-marker";
import { SetMarker } from "./set-marker";
import { VariableMarker } from "./variable-marker";

export class MarkerRegistry {
  private readonly markers: Map<AnswerFormat, MathsMarker> = new Map();

  constructor() {
    const numeric = new NumericMarker();
    const expression = new ExpressionMarker();

    this.markers = new Map<AnswerFormat, MathsMarker>([
      [AnswerFormat.Numeric, numeric],
      [AnswerFormat.Decimal, numeric],
      [AnswerFormat.Expression, expression],
      [AnswerFormat.Simplified, expression],
      [AnswerFormat.Factored, expression],
      [AnswerFormat.Equation, new EquationMarker()],
      [AnswerFormat.Set, new SetMarker()],
      [AnswerFormat.Variables, new VariableMarker()],
    ]);
  }

  markerFor(format: AnswerFormat | null): MathsMarker | null
  {
    if (format === null) return null;
    return this.markers.get(format) ?? null;
  }
}

