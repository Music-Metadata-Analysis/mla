const makeUniqueHookMock = <
  T extends Record<string, string | number | boolean | jest.Mock>
>(
  mockedObject: Record<keyof T, string | number | boolean | jest.Mock>
): T => {
  const uniqueMock = { ...mockedObject };
  (Object.keys(uniqueMock) as Array<keyof T>).forEach((key) => {
    if (typeof uniqueMock[key] === "function") {
      uniqueMock[key] = jest.fn();
    }
  });
  return uniqueMock as T;
};

export default makeUniqueHookMock;
