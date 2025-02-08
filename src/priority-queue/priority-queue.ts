// TODO: add keeping of values by id
export interface IPriorityQueueParams {
  type: 'max' | 'min';
}

export type IPriorityQueueNode<I> = {
  id: I;
  priority: number;
};

const maxPriorityQComparator = (a: number, b: number) => a - b;

const minPriorityQComparator = (a: number, b: number) => b - a;

export class PriorityQueue<I = unknown> {
  protected _type: IPriorityQueueParams['type'];
  protected _ids = new Map<I, number>();
  protected _heap: IPriorityQueueNode<I>[] = [];
  protected _comparator: typeof maxPriorityQComparator;

  constructor({ type }: IPriorityQueueParams) {
    this._type = type;
    this._comparator = type === 'max' ? maxPriorityQComparator : minPriorityQComparator;
  }

  get size() {
    return this._heap.length;
  }

  get(id: I) {
    const i = this._ids.get(id);
    if (i === undefined) return undefined;
    return this._heap[i];
  }

  getRoot() {
    return this._heap[0];
  }

  extractRoot() {
    const first = this._heap[0];
    if (first === undefined) return;
    this._swap(0, this._heap.length - 1);
    this._heap.length--;
    this._ids.delete(first.id);
    this._liftDown(0);
    return first;
  }

  add(id: I, priority: number) {
    if (this._ids.has(id)) {
      this._setPriority(id, priority);
      return;
    }

    this._addPriority(id, priority);
  }

  delete(id: I) {
    if (!this._ids.has(id)) return;
    this._setPriority(id, this._infinity());
    this.extractRoot();
  }

  protected _parent(i: number) {
    return (i - 1) >> 1;
  }

  protected _leftChild(i: number) {
    return (i << 1) + 1;
  }

  protected _rightChild(i: number) {
    return (i << 1) + 2;
  }

  protected _swap(i: number, j: number) {
    const temp = this._heap[i];
    this._setNode(i, this._heap[j]);
    this._setNode(j, temp);
  }

  protected _liftUp(i: number) {
    let parentI = this._parent(i);

    while (i > 0 && this._comparator(this._heap[i].priority, this._heap[parentI].priority) > 0) {
      this._swap(i, parentI);
      i = parentI;
      parentI = this._parent(parentI);
    }
  }

  protected _liftDown(i: number) {
    let toSwap = i;

    let childI = this._leftChild(i);
    if (childI < this.size && this._comparator(this._heap[toSwap].priority, this._heap[childI].priority) < 0) {
      toSwap = childI;
    }

    childI = this._rightChild(i);
    if (childI < this.size && this._comparator(this._heap[toSwap].priority, this._heap[childI].priority) < 0) {
      toSwap = childI;
    }

    if (toSwap !== i) {
      this._swap(i, toSwap);
      this._liftDown(toSwap);
    }
  }

  protected _setNode(i: number, node: IPriorityQueueNode<I>) {
    this._heap[i] = node;
    this._ids.set(node.id, i);
  }

  protected _setPriority(id: I, priority: number) {
    const i = this._ids.get(id);
    if (i === undefined) return;

    const oldPriority = this._heap[i].priority;
    this._heap[i].priority = priority;

    if (this._comparator(priority, oldPriority) > 0) {
      this._liftUp(i);
    } else {
      this._liftDown(i);
    }
  }

  protected _addPriority(id: I, priority: number) {
    const i = this._heap.length;
    this._setNode(i, {
      id,
      priority,
    });
    this._liftUp(i);
  }

  protected _infinity() {
    return this._type === 'max' ? Infinity : -Infinity;
  }
}
