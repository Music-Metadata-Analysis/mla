import { forwardRef } from "react";

class MockChakraReactComponents {
  protected createMock(Original: () => JSX.Element) {
    const createdMock = jest
      .fn()
      .mockImplementation(({ children, ...props }) => {
        return <Original {...props}>{children}</Original>;
      });
    return createdMock;
  }

  create = (mocks: string[], mocksWithRefs: string[] = []) => {
    const originalModule = jest.requireActual("@chakra-ui/react");
    const mockModule: { [key: string]: jest.Mock } = {
      __esModule: true,
      ...originalModule,
    };

    mocks.forEach((mock) => {
      mockModule[mock] = this.createMock(originalModule[mock]);
    });

    mocksWithRefs.forEach((mock) => {
      mockModule[mock] = this.createMock(originalModule[mock]);
      mockModule[`${mock}WithRef`] = mockModule[mock];
      mockModule[mock] = jest.mocked(forwardRef(mockModule[mock]));
    });

    return mockModule;
  };
}

export const createChakraMock = new MockChakraReactComponents().create;
