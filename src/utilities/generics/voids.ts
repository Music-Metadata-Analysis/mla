export const voidFn = (): null => null;

export const normalizeNull = <T>(value: T | null | undefined): null | T => {
  if (!value) return null;
  return value;
};

export const normalizeUndefined = <T>(
  value: T | null | undefined
): undefined | T => {
  if (!value) return undefined;
  return value;
};
