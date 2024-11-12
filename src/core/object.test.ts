import { areObjectsShallowlyEqual, isKeyOf, isNonNullable, isNonNullableObject } from './object';

describe('isKeyOf', () => {
  it('should return false when obj is not an object', () => {
    expect(isKeyOf('', 'key')).toBeFalsy();
  });

  it('should return false when key is not in obj', () => {
    expect(isKeyOf({}, 'key')).toBeFalsy();
  });

  it('should return true when key is in obj', () => {
    expect(isKeyOf({ key: '' }, 'key')).toBeTruthy();
  });
});

describe('isNonNullableObject', () => {
  it('should return false when value is not an object', () => {
    expect(isNonNullableObject('')).toBeFalsy();
  });

  it('should return false when value is null', () => {
    expect(isNonNullableObject(null)).toBeFalsy();
  });

  it('should return true when value is object', () => {
    expect(isNonNullableObject({})).toBeTruthy();
  });
});

describe('isNonNullable', () => {
  describe.each([
    {
      name: 'undefined param',
      param: undefined,
      expectedResult: false,
    },
    {
      name: 'null param',
      param: null,
      expectedResult: false,
    },
    {
      name: 'false param',
      param: false,
      expectedResult: true,
    },
    {
      name: 'true param',
      param: true,
      expectedResult: true,
    },
    {
      name: 'obj param',
      param: {},
      expectedResult: true,
    },
    {
      name: 'number param',
      param: 0,
      expectedResult: true,
    },
    {
      name: 'string param',
      param: '',
      expectedResult: true,
    },
  ])('should return true when object is not null or undefined', ({ name, param, expectedResult }) => {
    it(`${name}`, () => {
      expect(isNonNullable(param)).toBe(expectedResult);
    });
  });
});

describe('areObjectsShallowlyEqual', () => {
  const obj = {};

  describe.each([
    {
      name: 'empty objects',
      a: {},
      b: {},
      expectedResult: true,
    },
    {
      name: 'objects with the same primitive attrs values',
      a: {
        attrNum: 0,
        attrStr: '',
      },
      b: {
        attrNum: 0,
        attrStr: '',
      },
      expectedResult: true,
    },
    {
      name: 'objects with not the same primitive attrs values',
      a: {
        attrNum: 1,
        attrStr: '',
      },
      b: {
        attrNum: 0,
        attrStr: '',
      },
      expectedResult: false,
    },
    {
      name: 'objects with the different attrs',
      a: {
        attrNumU: 0,
        attrStr: '',
      },
      b: {
        attrNum: 0,
        attrStr: '',
      },
      expectedResult: false,
    },
    {
      name: 'objects with different number of attrs',
      a: {
        attrStr: '',
      },
      b: {
        attrNum: 0,
        attrStr: '',
      },
      expectedResult: false,
    },
    {
      name: 'objects with the same inner objects links',
      a: {
        attrObj: obj,
      },
      b: {
        attrObj: obj,
      },
      expectedResult: true,
    },
    {
      name: 'objects with different inner objects links',
      a: {
        attrObj: {},
      },
      b: {
        attrObj: {},
      },
      expectedResult: false,
    },
  ])('should return true when objects are shallowly equal', ({ name, a, b, expectedResult }) => {
    it(`${name}`, () => {
      expect(areObjectsShallowlyEqual(a, b)).toBe(expectedResult);
    });
  });
});
