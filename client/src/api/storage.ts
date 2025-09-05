type TIndexed = Record<string, unknown>;

export default class Storage {
  protected static _instance: Storage;
  protected static STORE_NAME = 'genesis-lab';
  protected _state: TIndexed = {};

  constructor() {
    if (Storage._instance) return Storage._instance;
    Storage._instance = this;

    if (typeof localStorage !== 'undefined') {
      const savedState = localStorage.getItem(Storage.STORE_NAME);
      if (savedState) {
        this._state = JSON.parse(savedState) as Record<string, unknown>;
      }
    }
  }

  public get<T>(key: string) {
    return this.getValue(key) as T | undefined;
  }

  public set<T = TIndexed>(key: string, value: T extends () => void ? never : T | ((_prev: T | undefined) => T)) {
    if (typeof value === 'function') {
      const prev = this.getValue(key) as T | undefined;
      this.setValue(key, value(prev));
    } else {
      this.setValue(key, value);
    }
    this.emit();
  }

  public push<T = TIndexed>(key: string, value: T) {
    const prev = this.getValue(key) as T | undefined;
    if (!prev) {
      this.setValue(key, [value]);
    } else {
      if (!Array.isArray(prev)) throw new Error(`${key} is not an array`);
      this.setValue(key, [...prev, value]);
    }
    this.emit();
  }

  protected getState() {
    return this._state;
  }

  protected setState<T extends TIndexed>(setter: (_prev: T) => T) {
    this._state = setter(this._state as T);
    this.emit();
  }

  protected clearState() {
    this._state = {};
    this.emit();
  }

  protected emit() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(Storage.STORE_NAME, JSON.stringify(this._state));
    }
  }

  private setValue = (path: string, value: unknown) => {
    let obj = this._state;
    const arr = path.split('.');
    const last = arr.pop();
    arr.forEach(key => {
      if (!obj[key]) obj[key] = {};
      obj = obj[key] as TIndexed;
    });
    if (last) obj[last] = value;
  };

  private getValue = (path: string): unknown => {
    return path
      .split('.')
      .reduce<
        TIndexed | undefined
      >((obj, key) => (obj && obj[key] !== undefined ? (obj[key] as TIndexed) : undefined), this._state);
  };
}
