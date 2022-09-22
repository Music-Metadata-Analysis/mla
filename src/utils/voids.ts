export const voidFn = () => null;

export const normalizeNull = <T>(value: T | null | undefined) => {
  if (!value) return null;
  return value;
};

export const normalizeUndefined = <T>(value: T | null | undefined) => {
  if (!value) return undefined;
  return value;
};
