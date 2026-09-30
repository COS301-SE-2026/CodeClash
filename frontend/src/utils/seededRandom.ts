/*
seeded random number generator for complexity analysis 
*/

export function hashSeed(value: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.codePointAt(i) ?? 0;
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

 // whole point is basically to have a deterministic random number generator
 // for randomised complexity analysis for now
 //


 export function seededRandom(seed: number | string): () => number {
     let state = (typeof seed === 'string' ? hashSeed(seed) : seed) >>> 0;
 
     return () => {
         state = (state + 0x6d2b79f5) >>> 0;
         let t = state;
         t = Math.imul(t ^ (t >>> 15), t | 1);
         t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
         return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
     };
 }