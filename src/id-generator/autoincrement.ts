export const createAutoincrementIdGenerator =
  (init = 0) =>
  () =>
    init++;
