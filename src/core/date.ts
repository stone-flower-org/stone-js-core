import { defaultComparator } from './function';
import { ISOPeriod, NullableISOPeriod } from './types';

export const SECOND_MS = 1000;
export const MINUTE_MS = 60000;
export const HOUR_MS = 3600000;

export const defaultISOPeriodComparator = (a: ISOPeriod, b: ISOPeriod) => defaultComparator(a[0], b[0]);

export const doesISODateInterceptISOPeriod = (date: string, period: ISOPeriod) =>
  date >= period[0] && date <= period[1];

export const doesISODateInterceptNullableISOPeriod = (date: string, period: NullableISOPeriod) => {
  if (period[0] && date < period[0]) return false;
  if (period[1] && date > period[1]) return false;
  return true;
};

export const doISOPeriodsIntercept = (a: ISOPeriod, b: ISOPeriod) => {
  const [left, right] = a[0] < b[0] ? [a, b] : [b, a];
  if (doesISODateInterceptISOPeriod(right[0], left)) return true;
  if (doesISODateInterceptISOPeriod(right[1], left)) return true;
  return false;
};

export const mergeISOPeriods = (a: ISOPeriod, b: ISOPeriod): ISOPeriod => {
  const from = a[0] < b[0] ? a[0] : b[0];
  const to = a[1] > b[1] ? a[1] : b[1];
  return [from, to];
};

export const mergeInterceptedPeriods = (periods: ISOPeriod[]): ISOPeriod[] => {
  const periodsCopy = [...periods].sort(defaultISOPeriodComparator);
  const mergedPeriods: ISOPeriod[] = periodsCopy.length ? [periodsCopy[0]] : [];

  for (let i = 1; i < periodsCopy.length; i++) {
    const prevMergedPeriod = mergedPeriods[mergedPeriods.length - 1];
    const period = periodsCopy[i];

    if (doISOPeriodsIntercept(prevMergedPeriod, period)) {
      const mergedPeriod = mergeISOPeriods(prevMergedPeriod, period);
      prevMergedPeriod[0] = mergedPeriod[0];
      prevMergedPeriod[1] = mergedPeriod[1];
      continue;
    }

    mergedPeriods.push(period);
  }

  return mergedPeriods;
};

export const getUnfilledISOPeriodsDuring = (periods: ISOPeriod[], during: ISOPeriod): ISOPeriod[] => {
  const mergedPeriods = mergeInterceptedPeriods([...periods, [during[0], during[0]], [during[1], during[1]]]);
  const unfilledPeriods: ISOPeriod[] = [];

  for (let i = 1; i < mergedPeriods.length; i++) {
    const prevPeriod = mergedPeriods[i - 1];
    const period = mergedPeriods[i];
    if (!doISOPeriodsIntercept(prevPeriod, during) || !doISOPeriodsIntercept(period, during)) continue;
    unfilledPeriods.push([prevPeriod[1], period[0]]);
  }

  return unfilledPeriods;
};
