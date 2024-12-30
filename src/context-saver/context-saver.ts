export interface ContextSaver {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useFunc<F extends (...args: any[]) => any>(callback: F): F;
}

export const createContextSaver = (that: object): ContextSaver => {
  const map = new Map<string, () => void>();
  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useFunc<F extends (...args: any[]) => any>(callback: F): F {
      let f = map.get(callback.name);
      if (f) return f as F;

      f = callback.bind(that);
      map.set(callback.name, f);

      return f as F;
    },
  };
};
