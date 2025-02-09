export interface NanoIdGeneratorParams {
  length: number;
  random: () => number;
}

const LETTERS = new Uint8Array([
  45, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82,
  83, 84, 85, 86, 87, 88, 89, 90, 95, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113,
  114, 115, 116, 117, 118, 119, 120, 121, 122,
]);

export const DEFAULT_NANO_ID_GENERATOR_PARAMS = {
  length: 21,
  random: Math.random,
} as const;

export const createNanoidGenerator = (params: Partial<NanoIdGeneratorParams> = {}) => {
  const { length, random } = { ...DEFAULT_NANO_ID_GENERATOR_PARAMS, ...params };
  return () => {
    const buffer = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      buffer[i] = LETTERS[(random() * LETTERS.length) | 0];
    }
    return String.fromCharCode.apply(undefined, buffer as unknown as number[]);
  };
};
