import {
  doesISODateInterceptISOPeriod,
  doISOPeriodsIntercept,
  getUnfilledISOPeriodsDuring,
  mergeInterceptedPeriods,
  mergeISOPeriods,
} from './date';
import { ISOPeriod } from './types';

const makeDefaultISOPeriods = () => [
  ['2023-02-01', '2023-04-01'] as ISOPeriod,
  ['2023-07-01', '2023-09-01'] as ISOPeriod,
];

describe('doesISODateInterceptISOPeriod', () => {
  it('should return true when date is inside given period', () => {
    expect(doesISODateInterceptISOPeriod('2023-01-01', ['2023-01-01', '2023-01-31'])).toBeTruthy();
  });

  it('should return false when date is out of given period', () => {
    expect(doesISODateInterceptISOPeriod('2022-12-31', ['2023-01-01', '2023-01-31'])).toBeFalsy();
  });
});

describe('doISOPeriodsIntercept', () => {
  it('should return true when periods partially overlap', () => {
    const a = ['2023-01-01', '2023-01-20'] as ISOPeriod;
    const b = ['2023-01-15', '2023-01-31'] as ISOPeriod;
    expect(doISOPeriodsIntercept(a, b)).toBeTruthy();
    expect(doISOPeriodsIntercept(b, a)).toBeTruthy();
  });

  it('should return true when one period in inside another', () => {
    const a = ['2023-01-01', '2023-01-31'] as ISOPeriod;
    const b = ['2023-01-15', '2023-01-20'] as ISOPeriod;
    expect(doISOPeriodsIntercept(a, b)).toBeTruthy();
    expect(doISOPeriodsIntercept(b, a)).toBeTruthy();
  });

  it("should return false when periods don't overlap", () => {
    const a = ['2023-01-01', '2023-01-10'] as ISOPeriod;
    const b = ['2023-01-20', '2023-01-31'] as ISOPeriod;
    expect(doISOPeriodsIntercept(a, b)).toBeFalsy();
    expect(doISOPeriodsIntercept(b, a)).toBeFalsy();
  });
});

describe.each([
  {
    testCase: 'a period is earlier',
    a: ['2023-01-01', '2023-01-10'] as ISOPeriod,
    b: ['2023-01-05', '2023-01-15'] as ISOPeriod,
    result: ['2023-01-01', '2023-01-15'],
  },
  {
    testCase: 'b period is earlier',
    a: ['2023-01-05', '2023-01-15'] as ISOPeriod,
    b: ['2023-01-01', '2023-01-10'] as ISOPeriod,
    result: ['2023-01-01', '2023-01-15'],
  },
])('mergeISOPeriods', ({ testCase, a, b, result }) => {
  it(`should merge periods into 1, case: ${testCase}`, () => {
    expect(mergeISOPeriods(a, b)).toEqual(result);
  });
});

describe.each([
  {
    testCase: 'periods partially intercepted',
    periods: [...makeDefaultISOPeriods(), ['2023-03-01', '2023-05-01'] as ISOPeriod],
    result: [['2023-02-01', '2023-05-01'] as ISOPeriod, ['2023-07-01', '2023-09-01'] as ISOPeriod],
  },
  {
    testCase: "periods don't intercept",
    periods: [...makeDefaultISOPeriods(), ['2023-05-01', '2023-06-01'] as ISOPeriod],
    result: [
      ['2023-02-01', '2023-04-01'],
      ['2023-05-01', '2023-06-01'],
      ['2023-07-01', '2023-09-01'],
    ],
  },
  {
    testCase: '1 period inside another',
    periods: [...makeDefaultISOPeriods(), ['2023-03-01', '2023-04-01'] as ISOPeriod],
    result: makeDefaultISOPeriods(),
  },
])('mergeInterceptedPeriods', ({ testCase, periods, result }) => {
  it(`should merge intercepted periods, case: ${testCase}`, () => {
    expect(mergeInterceptedPeriods(periods)).toEqual(result);
  });
});

describe.each([
  {
    testCase: 'during period wraps all periods',
    periods: makeDefaultISOPeriods(),
    during: ['2023-01-01', '2023-10-01'] as ISOPeriod,
    result: [
      ['2023-01-01', '2023-02-01'],
      ['2023-04-01', '2023-07-01'],
      ['2023-09-01', '2023-10-01'],
    ],
  },
  {
    testCase: 'during period intercept left part of period',
    periods: makeDefaultISOPeriods(),
    during: ['2023-01-01', '2023-03-01'] as ISOPeriod,
    result: [['2023-01-01', '2023-02-01']],
  },
  {
    testCase: 'during period intercepts right part of period',
    periods: makeDefaultISOPeriods(),
    during: ['2023-03-01', '2023-05-01'] as ISOPeriod,
    result: [['2023-04-01', '2023-05-01']],
  },
  {
    testCase: 'during period intercepts 2 close periods',
    periods: makeDefaultISOPeriods(),
    during: ['2023-03-01', '2023-08-01'] as ISOPeriod,
    result: [['2023-04-01', '2023-07-01']],
  },
  {
    testCase: "during period doesn't intercept periods",
    periods: makeDefaultISOPeriods(),
    during: ['2023-05-01', '2023-06-01'] as ISOPeriod,
    result: [['2023-05-01', '2023-06-01']],
  },
])('getUnfilledISOPeriodsDuring', ({ testCase, periods, during, result }) => {
  it(`should return unfilled periods during period, case: ${testCase}`, () => {
    expect(getUnfilledISOPeriodsDuring(periods, during)).toEqual(result);
  });
});
