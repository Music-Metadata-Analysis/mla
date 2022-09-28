import { forwardRef } from "react";

class MockChakraReactComponents {
  create = (mocks: string[]) => {
    const originalModule = jest.requireActual("@chakra-ui/react");
    const mockModule: Record<string, boolean | jest.Mock> = {
      __esModule: true,
      ...originalModule,
    };

    mocks.forEach((mock) => {
      const Original = originalModule[mock];
      const createdMock = jest
        .fn()
        .mockImplementation(({ children, ...props }) => {
          const Wrapped = forwardRef((props, ref) => (
            <Original ref={ref} {...props}>
              {children}
            </Original>
          ));
          Wrapped.displayName = Original.displayName;
          return <Wrapped {...props} />;
        });
      mockModule[mock] = createdMock;
    });

    return mockModule;
  };
}

export const createChakraMock = new MockChakraReactComponents().create;
