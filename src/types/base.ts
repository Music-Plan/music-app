export type WithKey = {
  key?: string;
};

export interface ClickableText {
  text: string;
  onClick?: {
    (text: string): void;
  };
}

export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[P] extends object
    ? RecursivePartial<T[P]>
    : T[P];
};
