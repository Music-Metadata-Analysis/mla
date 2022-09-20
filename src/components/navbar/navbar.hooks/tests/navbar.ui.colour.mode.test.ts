import { useColorMode } from "@chakra-ui/react";
import { renderHook } from "@testing-library/react-hooks";
import dk from "deep-keys";
import mockHookValues from "../__mocks__/navbar.ui.colour.mode.mock";
import useColourMode from "../navbar.ui.colour.mode";

jest.mock("@chakra-ui/react", () => ({
  useColorMode: jest.fn(),
}));

describe("useColourMode", () => {
  let received: ReturnType<typeof arrange>;

  const mockColorMode = "light";
  const mockToggle = jest.fn();

  const mockUseColorMode = {
    colorMode: mockColorMode,
    setColorMode: jest.fn(),
    toggleColorMode: mockToggle,
  } as ReturnType<typeof useColorMode>;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(useColorMode).mockReturnValue(mockUseColorMode);
  });

  const arrange = () => {
    return renderHook(() => useColourMode());
  };

  describe("when rendered", () => {
    beforeEach(() => {
      received = arrange();
    });

    it("should contain all the same properties as the mock hook", () => {
      const mockObjectKeys = dk(
        mockHookValues as unknown as Record<string, unknown>
      ).sort();
      const hookKeys = dk(
        received.result.current as unknown as Record<string, unknown>
      ).sort();
      expect(hookKeys).toStrictEqual(mockObjectKeys);
    });

    it("should contain the correct functions", () => {
      expect(typeof received.result.current.toggle).toBe("function");
    });

    it("should contain the expected properties", () => {
      expect(received.result.current.colourMode).toBe(mockColorMode);
    });
  });

  describe("toggle", () => {
    describe("when called", () => {
      beforeEach(() => {
        received.result.current.toggle();
      });

      it("should call the underlying vendor hook's toggleColorMode method correctly", () => {
        expect(mockToggle).toBeCalledTimes(1);
        expect(mockToggle).toBeCalledWith();
      });
    });
  });
});
