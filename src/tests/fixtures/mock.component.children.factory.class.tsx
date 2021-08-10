class MockComponentWithChildrenFactory {
  create = (name: string) => {
    return {
      __esModule: true,
      default: jest.fn(({ children }: { children: React.ReactChildren }) => {
        return <div data-testid={name}>{children}</div>;
      }),
    };
  };
}

export const factoryInstance = new MockComponentWithChildrenFactory();
