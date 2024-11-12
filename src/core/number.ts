export enum RoundType {
  DOWN,
  UP,
  HALF_UP,
  HALF_DOWN,
}

export interface RoundOptions {
  precision?: number;
  type?: RoundType;
}

const ROUND_BY_TYPE = {
  [RoundType.DOWN]: Math.floor,
  [RoundType.UP]: Math.ceil,
  [RoundType.HALF_DOWN]: (val: number) => -Math.round(-val),
  [RoundType.HALF_UP]: Math.round,
};

export const round = (val: number, { precision = 0, type = RoundType.HALF_UP }: RoundOptions = {}) => {
  precision = precision < 0 ? 0 : precision;
  const mul = 10 ** precision;
  return ROUND_BY_TYPE[type](val * mul) / mul;
};
