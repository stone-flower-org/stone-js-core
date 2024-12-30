import { defaultComparator } from './function';
import { BinaryPredicateFunc, Comparator } from './types';

export const emptyArr: unknown[] = [];

export const range = <V>(from: number, to: number, generator: (i: number) => V): V[] =>
  Array.from({ length: to - from + 1 }, (_, i) => generator(i + from));

export const areArraysEqual = <T extends unknown[]>(arrA: T, arrB: T, comparator: Comparator = defaultComparator) => {
  if (arrA.length !== arrB.length) return false;

  for (let i = 0; i < arrA.length; i++) {
    if (comparator(arrA[i], arrB[i]) !== 0) return false;
  }

  return true;
};

export const areArraysShallowlyEqual = <T extends unknown[]>(arrA: T, arrB: T) =>
  areArraysEqual(arrA, arrB, defaultComparator);

export const insert = <T = unknown>(arr: T[], index: number, ...items: T[]) => {
  arr.splice(index, 0, ...items);
};

export const binaryNarrow = <T = unknown>(sortedArr: T[], predicate: BinaryPredicateFunc<T>) => {
  let from = 0;
  let to = sortedArr.length - 1;
  let predicted = 0;

  while (from <= to) {
    const found = Math.floor((to - from) / 2) + from;
    predicted = predicate(sortedArr[found], found, sortedArr);
    if (predicted === 0) return { found, from, predicted, to };
    if (from === to) break;
    if (predicted < 0) {
      to = found;
      continue;
    }
    from = found + 1;
  }

  return { found: -1, from, predicted, to };
};

export const binaryFindIndex = <T = unknown>(sortedArr: T[], predicate: BinaryPredicateFunc<T>) =>
  binaryNarrow(sortedArr, predicate).found;

export const binaryFind = <T = unknown>(sortedArr: T[], predicate: BinaryPredicateFunc<T>) => {
  const index = binaryFindIndex(sortedArr, predicate);
  return sortedArr[index];
};

export const binaryInsert = <T = unknown>(sortedArr: T[], comparator: Comparator<T>, ...items: T[]) => {
  items.forEach((item) => {
    const { predicted, found, from } = binaryNarrow(sortedArr, (val) => comparator(item, val));
    insert(sortedArr, found === -1 ? from + Number(predicted > 0) : found, item);
  });
};

// TODO: write unit tests
export const forEach = <T>(iterator: Iterator<T>, callback: (item: T) => void) => {
  let res = iterator.next();
  while (!res.done) {
    callback(res.value);
    res = iterator.next();
  }
};
