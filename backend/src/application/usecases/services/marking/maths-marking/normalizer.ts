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
  return 0.5 * Math.pow(10, -precision);
}

function repeatReplace(input: string, pattern: RegExp, replacement: string): string {
  let current = input;
  for (let pass = 0; pass < 20; pass++) {
    const next = current.replace(pattern, replacement);
    if (next === current) return current;
    current = next;
  }
  return current; // linnked list implementatoin, 
}

function expandBracedCommands(input: string): string {
    let current = repeatReplace(input, /\\frac\{([^{}]*)\}\{([^{}]*)\}/g, "(($1)/($2))");
    current = repeatReplace(current, /\\sqrt\[([^\][]*)\]\{([^{}]*)\}/g, "nthRoot(($2),($1))");
    current = repeatReplace(current, /\\sqrt\{([^{}]*)\}/g, "sqrt($1)");
    return current;
}

// converting teh ascii / latex into plain inifix notation that mathjs can handle
export function normalize(input: string): string {
  let text = input.trim();
  if (text === "") return "";

  text = text.replace(/^\$+|\$+$/g, "");
      text = text.replaceAll("\\left", "").replaceAll("\\right", "");
      text = text.replace(/\\[,;:!]/g, "").replace(/\\q?quad/g, "").replace(/\\ /g, " ");
      text = text.replace(/\\cdot|\\times/g, "*").replace(/\\div/g, "/");
  text = text.replace(/\\pi/g, "pi");

  text = text.replace(/[−–—]/g, "-")
          .replace(/[×⋅·]/g, "*")
          .replace(/÷/g, "/");
  
      text = text.replace(/[⁰¹²³⁴-⁹⁺⁻]+/g, (run) =>
          "^(" + [...run].map((char) => SUPERSCRIPTS[char] ?? "").join("") + ")");
  
      text = expandBracedCommands(text);
      text = repeatReplace(text, /\^\{([^{}]*)\}/g, "^($1)");
      text = repeatReplace(text, /_\{([^{}]*)\}/g, "$1");
  text = text.replace(/_/g, "");

  text = text.replaceAll("{", "(").replaceAll("}", ")");
  return text.trim();
}

function isSafe(node: MathNode): boolean {
    let safe = true;
    node.traverse((child) => {
        if (!safe) return;
        switch (child.type) {
            case "OperatorNode":
            case "ConstantNode":
            case "ParenthesisNode":
                break;
            case "SymbolNode":
                if (BLOCKED_SYMBOLS.has((child as SymbolLike).name)) safe = false;
                break;
            case "FunctionNode": {
                const name = (child as FunctionLike).fn?.name;
                if (name === undefined || !ALLOWED_FUNCTIONS.has(name)) safe = false;
                break;
            }
            default:
                // assignments and blocks and functin definitions wouldnt be in a typical answer so it'd be sus
                safe = false;
        }
    });
    return safe;
}

export function safeParse(source: string): MathNode | null {
    const normalized = normalize(source);
    if (normalized === "") return null;

    let node: MathNode;
    try {
        node = parse(normalized);
    } catch {
        return null;
    }

    return isSafe(node) ? node : null;
}

export function variablesIn(...nodes: (MathNode | null)[]): string[] {
    const names = new Set<string>();
    for (const node of nodes) {
        if (node === null) continue;
        node.traverse((child, _path, parent) => {
            if (child.type !== "SymbolNode") return;
            // The callee of sqrt(x) is a SymbolNode too, but it is not a variable.
            if (parent !== null && parent.type === "FunctionNode" && (parent as FunctionLike).fn === child) return;
            const name = (child as SymbolLike).name;
            if (!CONSTANTS.has(name)) names.add(name);
        });
    }
    return [...names];
}

function evaluateAt(node: MathNode, values: Record<string, number>): number | null {
  try {
    const value: unknown = node.evaluate(values);
    return typeof value === "number" && Number.isFinite(value) ? value : null;
  } catch {
    return null;
  }
}

function samplePoints(variables: string[]): Record<string, number>[] {
    let seed = 20260903;
    const nextRandom = () => {
        seed = (seed * 1103515245 + 12345) % 2147483648;
        return seed / 2147483648;
    };

    const points: Record<string, number>[] = [];
    for (let index = 0; index < SAMPLE_COUNT; index++) {
        const scope: Record<string, number> = {};
        // The 0.137 offset keeps samples off the small integers that tend to be roots.
        for (const variable of variables) scope[variable] = Number((nextRandom() * 8 - 4 + 0.137).toFixed(6));
        points.push(scope);
    }
    return points;
}

export function closeRelative(left: number, right: number, tolerance = EQUIVALENCE_TOLERANCE): boolean {
    return Math.abs(left - right) <= tolerance * Math.max(1, Math.abs(left), Math.abs(right));
}

export function closeAbsolute(left: number, right: number, tolerance: number): boolean {
    return Math.abs(left - right) <= tolerance;
}

export function evaluateConstant(node: MathNode): number | null {
    return variablesIn(node).length === 0 ? evaluateAt(node, {}) : null;
}

export function equivalent(left: MathNode, right: MathNode): boolean {
    const variables = variablesIn(left, right);

    if (variables.length === 0) {
        const leftValue = evaluateAt(left, {});
        const rightValue = evaluateAt(right, {});
        return leftValue !== null && rightValue !== null && closeRelative(leftValue, rightValue);
    }

    let agreed = 0;
    for (const point of samplePoints(variables)) {
        const leftValue = evaluateAt(left, point);
        const rightValue = evaluateAt(right, point);
        // A pole or a domain error tells us nothing, so it is skipped rather than failed.
        if (leftValue === null || rightValue === null) continue;
        if (!closeRelative(leftValue, rightValue)) return false;
        agreed++;
    }

    return agreed >= MIN_SAMPLES;
}

export function splitTopLevel(source: string, separator: string): string[] {
    const parts: string[] = [];
    let depth = 0;
    let current = "";

    for (const char of source) {
        if (char === "(" || char === "[" || char === "{") depth++;
        else if (char === ")" || char === "]" || char === "}") depth--;

        if (char === separator && depth === 0) {
            parts.push(current);
            current = "";
            continue;
        }
        current += char;
    }
    parts.push(current);

    return parts.map((part) => part.trim()).filter((part) => part !== "");
}

export function degreeOf(node: MathNode): number {
    let degree = 0;
    node.traverse((child) => {
        if (child.type === "OperatorNode" && (child as OperatorLike).op === "^") {
            const args = (child as OperatorLike).args;
            const base = args[0];
            const exponent = args[1];
            if (base !== undefined && exponent !== undefined
                && variablesIn(base).length > 0 && exponent.type === "ConstantNode") {
                degree = Math.max(degree, Number((exponent as ConstantLike).value));
            }
        } else if (child.type === "SymbolNode" && !CONSTANTS.has((child as SymbolLike).name)) {
            degree = Math.max(degree, 1);
        }
    });
    return degree;
}

export function factorsOf(node: MathNode): MathNode[] {
    const factors: MathNode[] = [];

    const walk = (current: MathNode) => {
        if (current.type === "ParenthesisNode") {
            walk((current as MathNode & { content: MathNode }).content);
            return;
        }
        if (current.type === "OperatorNode") {
            const operator = current as OperatorLike;
            const [first, second] = operator.args;
            if (operator.op === "*" && first !== undefined && second !== undefined) {
                walk(first);
                walk(second);
                return;
            }
            // Dividing by a constant does not change whether the answer is factored.
            if (operator.op === "/" && first !== undefined && second !== undefined
                && variablesIn(second).length === 0) {
                walk(first);
                return;
            }
            if (operator.op === "-" && operator.args.length === 1 && first !== undefined) {
                walk(first);
                return;
            }
        }
        factors.push(current);
    };

    walk(node);
    return factors;
}