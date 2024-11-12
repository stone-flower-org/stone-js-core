import { vi } from 'vitest';

import { createNanoidGenerator } from './nanoid';

describe('createNanoidGenerator', () => {
  test('created generator should return nanoid of specified length', () => {
    const length = 3;
    const generator = createNanoidGenerator({ length });
    expect(generator()).toHaveLength(length);
  });

  test('created generator should return nanoid using specified random', () => {
    let calls = 0;
    const random = vi.fn().mockImplementation(() => calls++ / 64);
    const generator = createNanoidGenerator({ random });
    expect(generator()).toBe('-0123456789ABCDEFGHIJ');
  });
});
