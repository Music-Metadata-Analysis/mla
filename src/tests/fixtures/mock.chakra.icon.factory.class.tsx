class MockChakraIconComponents {
  create = (mocks: string[]) => {
    const originalModule = jest.requireActual("@chakra-ui/icons");
    const mockModule: Record<string, boolean | jest.Mock> = {
      __esModule: true,
      ...originalModule,
    };

    mocks.forEach((mock) => {
      const Original = originalModule[mock];
      const createdMock = jest
        .fn()
        .mockImplementation(({ children, ...props }) => (
          <Original {...props}>{children}</Original>
        ));
      mockModule[mock] = createdMock;
    });

    return mockModule;
  };
}
export const factoryInstance = new MockChakraIconComponents();
