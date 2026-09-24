/*
seeded random number generator for complexity analysis 
*/

export function hashSeed(value: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

 // whole point is basically to have a deterministic random number generator
 // for randomised complexity analysis for now
 //


