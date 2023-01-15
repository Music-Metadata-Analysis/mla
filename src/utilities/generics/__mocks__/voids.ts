export const normalizeNull = jest.fn(
  (value: unknown) => `normalizeNull(${value})`
);

export const normalizeUndefined = jest.fn(
  (value: unknown) => `normalizeUndefined(${value})`
);
