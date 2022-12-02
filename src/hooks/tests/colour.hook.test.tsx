import { renderHook } from "@testing-library/react-hooks";
import dk from "deep-keys";
import mockHookValues from "../__mocks__/colour.mock";
import useColour from "../colour";

jest.mock("@src/clients/ui.framework/vendor");

describe("useColour", () => {
  let received: ReturnType<typeof arrange>;

  const arrange = () => {
    return renderHook(() => useColour());
  };

  describe("when rendered", () => {
    beforeEach(() => {
      received = arrange();
    });

    it("should contain all the same properties as the mock colour hook", () => {
      const mockObjectKeys = dk(mockHookValues).sort();
      const hookKeys = dk(received.result.current).sort();
      expect(hookKeys).toStrictEqual(mockObjectKeys);
    });

    it("should contain the correct functions", () => {
      expect(received.result.current.utilities.colourToCSS).toBe(
        mockHookValues.utilities.colourToCSS
      );
    });

    it("should be an instance of the underlying vendor hook", () => {
      expect(received.result.current).toStrictEqual(mockHookValues);
    });

    describe("utilities", () => {
      describe("colourToCSS", () => {
        let result: string;

        const mockArgument = "grey-100";
        const mockResponse = "var(--chakra-colors-grey-100)";

        beforeEach(() => {
          mockHookValues.utilities.colourToCSS.mockReturnValueOnce(
            mockResponse
          );

          result = received.result.current.utilities.colourToCSS(mockArgument);
        });

        it("should call the underlying vendor hook's method", () => {
          expect(mockHookValues.utilities.colourToCSS).toBeCalledTimes(1);
          expect(mockHookValues.utilities.colourToCSS).toBeCalledWith(
            mockArgument
          );
        });

        it("should return the correct CSS colour variable", () => {
          expect(result).toBe(mockResponse);
        });
      });
    });
  });
});
