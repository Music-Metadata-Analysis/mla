import { act, renderHook } from "@testing-library/react";
import dk from "deep-keys";
import useScrollBarsController from "../scrollbars.controller.hook";
import { createHookWrapper } from "@src/fixtures/mocks/mock.hook.wrapper";
import mockHookValues from "@src/web/ui/scrollbars/generics/state/controllers/__mocks__/scrollbars.controller.hook.mock";
import { ScrollBarsControllerContext } from "@src/web/ui/scrollbars/generics/state/providers/scrollbars.provider";
import type { ScrollBarsControllerContextInterface } from "@src/web/ui/scrollbars/generics/types/state/provider.types";
import type { ReactNode } from "react";

interface MockInterfaceContextWithChildren {
  children?: ReactNode;
  mockContext: ScrollBarsControllerContextInterface;
}

describe("useScrollBarsController", () => {
  let received: ReturnType<typeof arrange>;

  const mockScrollBar1 = "mockScrollBar1";
  const mockScrollBar2 = "mockScrollBar2";
  const mockScrollBar3 = "mockScrollBar3";

  const mockSetter = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const providerWrapper = ({
    children,
    mockContext,
  }: MockInterfaceContextWithChildren) => {
    return (
      <ScrollBarsControllerContext.Provider value={mockContext}>
        {children}
      </ScrollBarsControllerContext.Provider>
    );
  };

  const arrange = (mockContext: ScrollBarsControllerContextInterface) => {
    return renderHook(() => useScrollBarsController(), {
      wrapper: createHookWrapper<MockInterfaceContextWithChildren>(
        providerWrapper,
        { mockContext }
      ),
    });
  };

  const checkProperties = () => {
    it("should contain all the same properties as the mock hook", () => {
      const mockObjectKeys = dk(mockHookValues).sort();
      const hookKeys = dk(received.result.current).sort();
      expect(hookKeys).toStrictEqual(mockObjectKeys);
    });

    it("should contain the correct functions", () => {
      expect(received.result.current.add).toBeInstanceOf(Function);
      expect(received.result.current.current).toBeInstanceOf(Function);
      expect(received.result.current.remove).toBeInstanceOf(Function);
    });
  };

  const checkAdd = ({
    initialStack,
    newItem,
  }: {
    initialStack: Array<string>;
    newItem: string;
  }) => {
    describe("add", () => {
      if (initialStack.length > 0) {
        describe("when called with an old scrollbar id", () => {
          beforeEach(() => {
            act(() =>
              received.result.current.add(initialStack[initialStack.length - 1])
            );
          });

          it("should keep the currently selected scrollbar value", () => {
            expect(mockSetter).toBeCalledTimes(1);

            const fn = mockSetter.mock.calls[0][0];

            expect(fn(initialStack)).toStrictEqual(initialStack);
          });
        });
      }

      describe("when called with a new scrollbar id", () => {
        beforeEach(() => {
          act(() => received.result.current.add(newItem));
        });

        it("should update the currently selected scrollbar value", () => {
          expect(mockSetter).toBeCalledTimes(1);

          const fn = mockSetter.mock.calls[0][0];

          expect(fn(initialStack)).toStrictEqual(
            initialStack.concat([newItem])
          );
        });
      });

      describe("when called with an invalid scrollbar id", () => {
        beforeEach(() => {
          act(() => received.result.current.add(undefined));
        });

        it("should keep the currently selected scrollbar value", () => {
          expect(mockSetter).toBeCalledTimes(0);
        });
      });
    });
  };

  const checkRemove = ({ initialStack }: { initialStack: Array<string> }) => {
    describe("remove", () => {
      beforeEach(() => {
        act(() => received.result.current.remove());
      });

      it("should restore the stack to an empty one", () => {
        expect(mockSetter).toBeCalledTimes(1);

        const fn = mockSetter.mock.calls[0][0];

        expect(fn(initialStack)).toStrictEqual(
          initialStack.slice(0, initialStack.length - 1)
        );
      });
    });
  };

  const checkCurrent = ({ expectedValue }: { expectedValue?: string }) => {
    describe("current", () => {
      let result: string | undefined;

      beforeEach(() => {
        act(() => {
          result = received.result.current.current();
        });
      });

      it(`should return ${expectedValue}`, () => {
        expect(result).toBe(expectedValue);
      });
    });
  };

  describe("when there are no scrollbars on the stack", () => {
    beforeEach(() => {
      received = arrange({ stack: [], setStack: mockSetter });
    });

    checkProperties();
    checkAdd({
      initialStack: [],
      newItem: mockScrollBar1,
    });
    checkRemove({ initialStack: [] });
    checkCurrent({ expectedValue: undefined });
  });

  describe("when there is a single scrollbar on the stack", () => {
    beforeEach(() => {
      received = arrange({ stack: [mockScrollBar1], setStack: mockSetter });
    });

    checkProperties();
    checkAdd({
      initialStack: [mockScrollBar1],
      newItem: mockScrollBar2,
    });
    checkRemove({ initialStack: [mockScrollBar1] });
    checkCurrent({ expectedValue: mockScrollBar1 });
  });

  describe("when there are two scrollbars on the stack", () => {
    beforeEach(() => {
      received = arrange({
        stack: [mockScrollBar1, mockScrollBar2],
        setStack: mockSetter,
      });
    });

    checkProperties();
    checkAdd({
      initialStack: [mockScrollBar1, mockScrollBar2],
      newItem: mockScrollBar3,
    });
    checkRemove({ initialStack: [mockScrollBar1, mockScrollBar2] });
    checkCurrent({ expectedValue: mockScrollBar2 });
  });
});
