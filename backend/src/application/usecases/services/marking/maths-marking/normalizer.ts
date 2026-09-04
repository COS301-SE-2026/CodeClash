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

const BLOCKED_SYMBOLS = new Set([
    "config", "import", "createUnit", "evaluate", "parse", "simplify",
    "derivative", "chain", "help", "clone"
]);

const CONSTANTS = new Set(["pi", "e", "tau", "phi", "i", "Infinity", "NaN"]);

const SUPERSCRIPTS: Record<string, string> = {
    "⁰": "0", "¹": "1", "²": "2", "³": "3", "⁴": "4",
    "⁵": "5", "⁶": "6", "⁷": "7", "⁸": "8", "⁹": "9",
    "⁺": "+", "⁻": "-"
};

export const EQUIVALENCE_TOLERANCE = 1e-9;
const SAMPLE_COUNT = 12;
const MIN_SAMPLES = 5;


export function toleranceFor(precision: number | null): number {
    if (precision === null) return EQUIVALENCE_TOLERANCE;
    return precision;
}

