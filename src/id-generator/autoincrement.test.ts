import { createAutoincrementIdGenerator } from './autoincrement';

describe('createAutoincrementIdGenerator', () => {
  it('should return generator which will return inceremented number after each call starting from 0', () => {
    const generator = createAutoincrementIdGenerator();
    expect(generator()).toBe(1);
    expect(generator()).toBe(2);
  });

  it('should return generator which will return inceremented number after each call starting from given val', () => {
    const generator = createAutoincrementIdGenerator(10);
    expect(generator()).toBe(11);
    expect(generator()).toBe(12);
  });
});
