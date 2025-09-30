export const Zone = {
  current: {
    get: () => { },
    run: (fn: () => any) => fn(),
    runGuarded: (fn: () => any) => fn(),
    runTask: (fn: () => any) => fn(),
  },
};

export function noop() { }
export function patchMethod() { return noop; }

export default {
  Zone,
  __symbol__: (name: string) => `__${name}__`,
};
