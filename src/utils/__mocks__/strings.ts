export const capitalize = jest.fn(
  (value: string): string => `capitalize(${value})`
);

export const singular = jest.fn(
  (value: string): string => `singular(${value})`
);

export const truncate = jest.fn(
  (value: string, maximumLength: number) =>
    `truncate@${maximumLength}(${value})`
);
