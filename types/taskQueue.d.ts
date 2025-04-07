export type SimpleTask = {
  name: string;
  run: () => void;
};

export type PromiseTask = {
  name: string;
  gen: () => Promise<void>;
};

export type Task = SimpleTask | PromiseTask | (() => void);
