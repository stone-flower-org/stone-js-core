export type ITouchedMapIterator<K, V> = (v: V, k: K) => void;

export class TouchedMap<K, V> extends Map<K, V> {
  protected _touched = new Set<K>();

  touch(k: K, touched: boolean) {
    if (!this.has(k)) return;

    if (touched) {
      this._touched.add(k);
    } else {
      this._touched.delete(k);
    }
  }

  touchAll(touched: boolean) {
    if (touched) {
      this.forEach((_, key) => {
        this.touch(key, true);
      });
    } else {
      this._touched.clear();
    }
  }

  isTouched(k: K) {
    return this._touched.has(k);
  }

  forEachTouched(callback: ITouchedMapIterator<K, V>) {
    this.forEach((val, key) => {
      if (this.isTouched(key)) callback(val, key);
    });
  }

  forEachUntouched(callback: ITouchedMapIterator<K, V>) {
    this.forEach((val, key) => {
      if (!this.isTouched(key)) callback(val, key);
    });
  }

  clear() {
    super.clear();
    this._touched.clear();
  }

  delete(key: K) {
    const res = super.delete(key);
    if (res) this._touched.delete(key);
    return res;
  }
}
