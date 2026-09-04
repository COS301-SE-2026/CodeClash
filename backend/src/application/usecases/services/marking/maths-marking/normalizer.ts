// will look back in to avoid hard coding the tolerance
import { MathNode, parse } from "mathjs";

type OperatorLike = MathNode & { op: string; args: MathNode[] };
type ConstantLike = MathNode & { value: unknown };
type SymbolLike = MathNode & { name: string };
type FunctionLike = MathNode & { fn: MathNode & { name?: string } };

const ALLOWED_FUNCTIONS = new Set([
    "sqrt", "cbrt", "nthRoot", "abs", "exp", "log", "log10", "log2",
    "sin", "cos", "tan", "asin", "acos", "atan",
    "sinh", "cosh", "tanh", "pow", "sign"
]);
\


export function toleranceFor(precision: number | null): number {
    if (precision === null) return EQUIVALENCE_TOLERANCE;
    return precision;
}
export const EQUIVALENCE_TOLERANCE = 0.01;
