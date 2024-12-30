import { NonNullable, Nullable, TypeByName, TypeName, ValidObjectKey } from './types';

export const emptyObj = {};

export const isNonNullable = <T>(param: T): param is NonNullable<T> => param !== undefined && param !== null;

export const isNonNullableObject = <O>(obj: O): obj is NonNullable<O & object> =>
  typeof obj === 'object' && isNonNullable(obj);

export const isKeyOf = <O>(obj: O, key: Nullable<ValidObjectKey>): key is keyof O =>
  isNonNullableObject(obj) && isNonNullable(key) && key in obj;

export const areObjectsShallowlyEqual = <O extends object>(a: O, b: O): boolean => {
  const keys = new Set<string>();
  Object.keys(a).forEach(keys.add.bind(keys));
  Object.keys(b).forEach(keys.add.bind(keys));
  for (const key of keys) {
    const aVal: unknown = isKeyOf(a, key) ? a[key] : undefined;
    const bVal: unknown = isKeyOf(b, key) ? b[key] : undefined;
    if (aVal !== bVal) return false;
  }
  return true;
};

// TODO: write unit tests
export const isType = <T extends TypeName>(a: unknown, type: T): a is TypeByName[T] => typeof a === type;
