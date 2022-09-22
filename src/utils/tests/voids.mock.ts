export const mockNormalizeNull = jest.fn(
  (value: unknown) => `normalizeNull(${value})`
);

export const mockNormalizeUndefined = jest.fn(
  (value: unknown) => `normalizeUndefined(${value})`
);
