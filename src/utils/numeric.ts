export const valueToZero = (value: number | undefined | null) => {
  if (value) return value;
  return 0;
};
