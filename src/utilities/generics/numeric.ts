export const valueToZero = (value: number | undefined | null): number => {
  if (value) return value;
  return 0;
};
