import { vi } from 'vitest';

import { compose, defaultComparator, inverseComparator, memoizeFunc } from './function';

const comparator = (a: number, b: number) => a - b;

const obj = {};

describe.each([
  {
    caseName: 'equal params',
    comparator: comparator,
    params: [1, 1],
    expectedResult: -0,
  },
  {
    caseName: 'first arg greater than second',
    comparator: comparator,
    params: [2, 1],
    expectedResult: -1,
  },
  {
    caseName: 'first arg less than second',
    comparator: comparator,
    params: [1, 2],
    expectedResult: 1,
  },
])('inverseComparator', ({ comparator, params, expectedResult, caseName }) => {
  it(`should inverse comparator result, name: ${caseName}`, () => {
    expect(inverseComparator(comparator)(params[0], params[1])).toBe(expectedResult);
  });
});

describe.each([
  {
    caseName: 'equal number params',
    params: [1, 1],
    expectedResult: 0,
  },
  {
    caseName: 'number params, first greater than second',
    params: [2, 1],
    expectedResult: 1,
  },
  {
    caseName: 'number params, first less than second',
    params: [1, 2],
    expectedResult: -1,
  },
  {
    caseName: 'same objects',
    params: [obj, obj],
    expectedResult: 0,
  },
  {
    caseName: 'different objects',
    params: [obj, {}],
    expectedResult: -1,
  },
])('defaultComparator', ({ caseName, params, expectedResult }) => {
  it(`should use default JS comparison for given params, name: ${caseName}`, () => {
    expect(defaultComparator(params[0], params[1])).toBe(expectedResult);
  });
});

describe('memoizeFunc', () => {
  const obj = {};

  describe.each([
    {
      name: 'no arguments',
      func: vi.fn().mockReturnValue(1),
      calls: [
        {
          args: [],
          expectedResult: 1,
        },
        {
          args: [],
          expectedResult: 1,
        },
      ],
      expectedCallCount: 1,
    },
    {
      name: 'different arguments length',
      func: vi.fn().mockReturnValue(1),
      calls: [
        {
          args: [1],
          expectedResult: 1,
        },
        {
          args: [1, 2],
          expectedResult: 1,
        },
      ],
      expectedCallCount: 2,
    },
    {
      name: 'different primitive arguments',
      func: vi.fn().mockReturnValue(1),
      calls: [
        {
          args: [1, 2],
          expectedResult: 1,
        },
        {
          args: [1, 3],
          expectedResult: 1,
        },
      ],
      expectedCallCount: 2,
    },
    {
      name: 'the same primitive arguments',
      func: vi.fn().mockReturnValue(1),
      calls: [
        {
          args: [1, 2],
          expectedResult: 1,
        },
        {
          args: [1, 2],
          expectedResult: 1,
        },
      ],
      expectedCallCount: 1,
    },
    {
      name: 'arguments with different objects',
      func: vi.fn().mockReturnValue(1),
      calls: [
        {
          args: [obj, obj],
          expectedResult: 1,
        },
        {
          args: [obj, {}],
          expectedResult: 1,
        },
      ],
      expectedCallCount: 2,
    },
    {
      name: 'arguments with the same objects',
      func: vi.fn().mockReturnValue(1),
      calls: [
        {
          args: [obj, obj],
          expectedResult: 1,
        },
        {
          args: [obj, obj],
          expectedResult: 1,
        },
      ],
      expectedCallCount: 2,
    },
  ])('should cache call results by call arguments', ({ name, func, calls, expectedCallCount }) => {
    it(`${name}`, () => {
      const memoizedFunc = memoizeFunc(func);
      calls.forEach(({ args, expectedResult }) => {
        expect(memoizedFunc(...args)).toBe(expectedResult);
      });
      expect(func).toHaveBeenCalledTimes(expectedCallCount);
    });
  });

  it('should return different promises when async func is called with different args', async () => {
    const expectedResult = 1;
    const func = vi.fn().mockImplementation(() => Promise.resolve(expectedResult));
    const memoizedFunc = memoizeFunc(func);

    const result0 = memoizedFunc(1);
    const result1 = memoizedFunc(2);

    expect(result0).not.toBe(result1);
    expect(await result0).toBe(expectedResult);
    expect(await result1).toBe(expectedResult);
  });

  it('should return the same promises when async func is called with the same args', async () => {
    const expectedResult = 1;
    const func = vi.fn().mockImplementation(() => Promise.resolve(expectedResult));
    const memoizedFunc = memoizeFunc(func);

    const result0 = memoizedFunc(1);
    const result1 = memoizedFunc(1);

    expect(result0).toBe(result1);
    expect(await result0).toBe(expectedResult);
    expect(await result1).toBe(expectedResult);
  });

  it('should clear oldest result from cache when calls history exceeds cacheSize', () => {
    const func = vi.fn().mockImplementation((a) => a);
    const memoizedFunc = memoizeFunc(func, { cacheSize: 2 });

    for (let i = 1; i < 4; i++) {
      expect(memoizedFunc(i)).toBe(i);
      expect(memoizedFunc(i)).toBe(i);
      expect(func).toHaveBeenCalledTimes(i);
    }

    expect(memoizedFunc(3)).toBe(3);
    expect(func).toHaveBeenCalledTimes(3);
    expect(memoizedFunc(2)).toBe(2);
    expect(func).toHaveBeenCalledTimes(3);
    expect(memoizedFunc(1)).toBe(1);
    expect(func).toHaveBeenCalledTimes(4);
  });

  it('should clear cache after clearCache call', () => {
    const func = vi.fn().mockImplementation((a) => a);
    const memoizedFunc = memoizeFunc(func);
    const calls = 3;

    for (let i = 0; i < calls; i++) {
      expect(memoizedFunc(i)).toBe(i);
      expect(func).toHaveBeenCalledTimes(i + 1);
    }

    memoizedFunc.clearCache();
    for (let i = 0; i < calls; i++) {
      expect(memoizedFunc(i)).toBe(i);
      expect(func).toHaveBeenCalledTimes(calls + i + 1);
    }
  });
});

describe('compose', () => {
  it('should return result after running sequance of functions', () => {
    function first(param: number) {
      return String(param + 1);
    }
    function second(param: string) {
      return param + 'a';
    }
    function third(param: string) {
      return param + 'b';
    }
    const composition = compose(first).next(second).next(third).produce();
    expect(composition(1)).toBe('2ab');
  });
});
