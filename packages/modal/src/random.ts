/* Mersenne Twister constants */
const N = 624;
const M = 397;
const MATRIX_A = 0x9908b0df; /* constant vector a */
const UPPER_MASK = 0x80000000; /* most significant w-r bits */
const LOWER_MASK = 0x7fffffff; /* least significant r bits */

/* Mersenne Twister
 *
 * Original implementation at https://gist.github.com/banksean/300494
 */
export class MersenneTwister {
  private mt: number[];
  private mti: number;

  constructor(private readonly seed: number) {
    this.mt = new Array(N); /* the array for the state vector */
    this.mti = N + 1; /* mti==N+1 means mt[N] is not initialized */

    this.init();
  }

  private init() {
    this.mt[0] = this.seed >>> 0;

    for (this.mti = 1; this.mti < N; this.mti++) {
      const s = this.mt[this.mti - 1] ^ (this.mt[this.mti - 1] >>> 30);
      this.mt[this.mti] =
        ((((s & 0xffff0000) >>> 16) * 1812433253) << 16) +
        (s & 0x0000ffff) * 1812433253 +
        this.mti;
      /* See Knuth TAOCP Vol2. 3rd Ed. P.106 for multiplier. */
      /* In the previous versions, MSBs of the seed affect   */
      /* only MSBs of the array mt[].                        */
      /* 2002/01/09 modified by Makoto Matsumoto             */
      this.mt[this.mti] >>>= 0;
      /* for >32 bit machines */
    }
  }

  private randomNumber() {
    let y: number;
    const mag01 = [0x0, MATRIX_A];
    /* mag01[x] = x * MATRIX_A  for x=0,1 */

    if (this.mti >= N) {
      /* generate N words at one time */
      let kk: number;

      for (kk = 0; kk < N - M; kk++) {
        y = (this.mt[kk] & UPPER_MASK) | (this.mt[kk + 1] & LOWER_MASK);
        this.mt[kk] = this.mt[kk + M] ^ (y >>> 1) ^ mag01[y & 0x1];
      }
      for (; kk < N - 1; kk++) {
        y = (this.mt[kk] & UPPER_MASK) | (this.mt[kk + 1] & LOWER_MASK);
        this.mt[kk] = this.mt[kk + (M - N)] ^ (y >>> 1) ^ mag01[y & 0x1];
      }
      y = (this.mt[N - 1] & UPPER_MASK) | (this.mt[0] & LOWER_MASK);
      this.mt[N - 1] = this.mt[M - 1] ^ (y >>> 1) ^ mag01[y & 0x1];

      this.mti = 0;
    }

    y = this.mt[this.mti++];

    /* Tempering */
    y ^= y >>> 11;
    y ^= (y << 7) & 0x9d2c5680;
    y ^= (y << 15) & 0xefc60000;
    y ^= y >>> 18;

    return y >>> 0;
  }

  random() {
    return this.randomNumber() / 0xffffffff;
  }
}

export function shuffle<T>(seed: number, arr: readonly T[]): T[] {
  const shuffled = arr.slice();
  const rng = new MersenneTwister(seed);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
