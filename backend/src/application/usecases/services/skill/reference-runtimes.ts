// basic reference runtimes for optimal solutions for the program questions e have so far, once we have a proper table and system set 
// for optimal solutions for each question this will be further updated, but it will do the job for now fr !!


const REFERENCE_RUNTIMES_MS = new Map<string, number>([
  ['Reverse a String', 10],
  ['Nth Fibonacci Number', 10],
  // best of 5 runs of the reference solutions (slowest test case), measured locally under Rosetta
  ['Darts', 47],
  ['Hello World', 41],
  ['Isbn Verifier', 47],
  ['Isogram', 50],
  ['Perfect Numbers', 45],
  ['Resistor Color', 44],
  ['Resistor Color Duo', 45],
  ['Rotational Cipher', 46]
]);

const DEFAULT_REFERENCE_RUNTIME_MS = 10;

export const referenceRuntimeMs = (title: string): number => 
  REFERENCE_RUNTIMES_MS.get(title) ?? DEFAULT_REFERENCE_RUNTIME_MS;