export interface ICollection<T extends object = object, I extends T[keyof T] = T[keyof T]> {
  add(items: T[]): void;
  delete(ids: I[]): void;
  get(ids: I[]): T[];
  getAll(): T[];
}

export interface ICollectionOptions<T extends object = object, I extends T[keyof T] = T[keyof T]> {
  idGetter: IdGetter<T, I>;
  items?: T[];
}

export type IdGetter<T extends object, I extends T[keyof T]> = (obj: T) => I;

export class Collection<T extends object = object, I extends T[keyof T] = T[keyof T]> implements ICollection<T, I> {
  protected _items: Map<I, T> = new Map();
  protected _idGetter: IdGetter<T, I>;

  constructor({ idGetter, items }: ICollectionOptions<T, I>) {
    this._idGetter = idGetter;
    this.add(items ?? []);
  }

  add(items: T[]) {
    items.forEach((item) => {
      this._items.set(this._idGetter(item), item);
    });
  }

  delete(ids: I[]): void {
    ids.forEach((id) => {
      this._items.delete(id);
    });
  }

  get(ids: I[]) {
    return ids.reduce((items, id) => {
      const item = this._items.get(id);
      if (item) items.push(item);
      return items;
    }, [] as T[]);
  }

  getAll() {
    return [...this._items.values()];
  }
}
