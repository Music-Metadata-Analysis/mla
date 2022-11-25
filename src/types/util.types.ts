export type Modify<T, R> = Omit<T, keyof R> & R;

export type MakeOptional<Type, Key extends keyof Type> = Omit<Type, Key> &
  Partial<Pick<Type, Key>>;
