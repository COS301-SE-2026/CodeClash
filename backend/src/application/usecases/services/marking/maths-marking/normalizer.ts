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
  return 0.5 * Math.pow(10, precision);;
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