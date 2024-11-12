import {
  isErrorStatus,
  isIdleStatus,
  isLoadedStatus,
  isLoadingStatus,
  isSuccessStatus,
  ProcessingStatus,
} from './processing-status';

describe.each([
  {
    status: ProcessingStatus.ERROR,
    result: true,
  },
  {
    status: ProcessingStatus.IDLE,
    result: false,
  },
  {
    status: ProcessingStatus.LOADING,
    result: false,
  },
  {
    status: ProcessingStatus.SUCCESS,
    result: false,
  },
])('isErrorStatus', ({ status, result }) => {
  it(`should return ${String(result)} when status is ${status}`, () => {
    expect(isErrorStatus(status)).toBe(result);
  });
});

describe.each([
  {
    status: ProcessingStatus.ERROR,
    result: false,
  },
  {
    status: ProcessingStatus.IDLE,
    result: true,
  },
  {
    status: ProcessingStatus.LOADING,
    result: false,
  },
  {
    status: ProcessingStatus.SUCCESS,
    result: false,
  },
])('isIdleStatus', ({ status, result }) => {
  it(`should return ${String(result)} when status is ${status}`, () => {
    expect(isIdleStatus(status)).toBe(result);
  });
});

describe.each([
  {
    status: ProcessingStatus.ERROR,
    result: false,
  },
  {
    status: ProcessingStatus.IDLE,
    result: false,
  },
  {
    status: ProcessingStatus.LOADING,
    result: true,
  },
  {
    status: ProcessingStatus.SUCCESS,
    result: false,
  },
])('isLoadingStatus', ({ status, result }) => {
  it(`should return ${String(result)} when status is ${status}`, () => {
    expect(isLoadingStatus(status)).toBe(result);
  });
});

describe.each([
  {
    status: ProcessingStatus.ERROR,
    result: false,
  },
  {
    status: ProcessingStatus.IDLE,
    result: false,
  },
  {
    status: ProcessingStatus.LOADING,
    result: false,
  },
  {
    status: ProcessingStatus.SUCCESS,
    result: true,
  },
])('isSuccessStatus', ({ status, result }) => {
  it(`should return ${String(result)} when status is ${status}`, () => {
    expect(isSuccessStatus(status)).toBe(result);
  });
});

describe.each([
  {
    status: ProcessingStatus.ERROR,
    result: true,
  },
  {
    status: ProcessingStatus.IDLE,
    result: false,
  },
  {
    status: ProcessingStatus.LOADING,
    result: false,
  },
  {
    status: ProcessingStatus.SUCCESS,
    result: true,
  },
])('isLoadedStatus', ({ status, result }) => {
  it(`should return ${String(result)} when status is ${status}`, () => {
    expect(isLoadedStatus(status)).toBe(result);
  });
});
