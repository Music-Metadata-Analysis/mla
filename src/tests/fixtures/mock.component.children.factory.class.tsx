class MockComponentWithChildrenFactory {
  create = (name: string, exportName = "default") => {
    const mockModule: { [index: string]: jest.Mock | string | boolean } = {
      __esModule: true,
    };
    mockModule[exportName] = jest.fn(
      ({ children }: { children: React.ReactChildren }) => {
        return <div data-testid={name}>{children}</div>;
      }
    );
    return mockModule;
  };
}

export const factoryInstance = new MockComponentWithChildrenFactory();
