/** Tiny observable store: get / set(patch) / subscribe. No library. */
export type Listener<S> = (state: S, prev: S) => void;

export class Store<S extends object> {
  private state: S;
  private listeners = new Set<Listener<S>>();

  constructor(initial: S) {
    this.state = initial;
  }

  get(): S {
    return this.state;
  }

  set(patch: Partial<S>): void {
    const prev = this.state;
    const next = { ...prev, ...patch };
    if ((Object.keys(patch) as (keyof S)[]).every((k) => Object.is(prev[k], next[k]))) return;
    this.state = next;
    for (const l of [...this.listeners]) l(next, prev);
  }

  subscribe(l: Listener<S>): () => void {
    this.listeners.add(l);
    return () => this.listeners.delete(l);
  }

  /** Call fn whenever the selected value changes (and once now). */
  watch<T>(select: (s: S) => T, fn: (v: T, s: S) => void): () => void {
    let last = select(this.state);
    fn(last, this.state);
    return this.subscribe((s) => {
      const v = select(s);
      if (!Object.is(v, last)) {
        last = v;
        fn(v, s);
      }
    });
  }
}
