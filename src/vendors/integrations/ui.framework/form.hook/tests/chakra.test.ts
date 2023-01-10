import { useToast } from "@chakra-ui/react";
import { renderHook } from "@testing-library/react-hooks";
import dk from "deep-keys";
import useChakraForm from "../chakra";
import { mockFormHook } from "@src/vendors/integrations/ui.framework/__mocks__/vendor.mock";

jest.mock("@chakra-ui/react", () => ({
  useToast: jest.fn(),
}));

describe("useChakraForm", () => {
  let received: ReturnType<typeof arrange>;

  const testField = "test_field";
  const testMessage = "test_message";

  type chakraToastType = jest.Mock &
    Record<keyof ReturnType<typeof useToast>, jest.Mock>;

  const mockToast = jest.fn() as chakraToastType;
  mockToast.isActive = jest.fn();
  mockToast.close = jest.fn();
  mockToast.closeAll = jest.fn();
  mockToast.update = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    return renderHook(() => useChakraForm());
  };

  const checkProperties = () => {
    it("should contain all the same properties as the mock hook", () => {
      const mockObjectKeys = dk(mockFormHook).sort();
      const hookKeys = dk(received.result.current).sort();
      expect(hookKeys).toStrictEqual(mockObjectKeys);
    });

    it("should contain the correct functions", () => {
      expect(typeof received.result.current.error.close).toBe("function");
      expect(typeof received.result.current.error.open).toBe("function");
    });
  };

  describe("when a toast is present", () => {
    beforeEach(() => {
      jest.mocked(mockToast.isActive).mockReturnValue(true);
      jest.mocked(useToast).mockImplementation(() => mockToast);

      received = arrange();
    });

    checkProperties();

    describe("open", () => {
      beforeEach(() =>
        received.result.current.error.open(testField, testMessage)
      );

      it("should NOT generate a new toast", () => {
        expect(mockToast).toBeCalledTimes(0);
        expect(mockToast.isActive).toBeCalledTimes(1);
        expect(mockToast.close).toBeCalledTimes(0);
      });

      it("should update the toast", () => {
        expect(mockToast.update).toBeCalledTimes(1);
        expect(mockToast.update).toBeCalledWith(testField, {
          duration: 1000,
          isClosable: false,
          status: "error",
          title: testMessage,
        });
      });
    });

    describe("close", () => {
      beforeEach(() => received.result.current.error.close(testField));

      it("should close the toast toast", () => {
        expect(mockToast).toBeCalledTimes(0);
        expect(mockToast.isActive).toBeCalledTimes(1);
        expect(mockToast.close).toBeCalledTimes(1);
        expect(mockToast.close).toBeCalledWith(testField);
      });
    });
  });

  describe("when a toast is NOT present", () => {
    beforeEach(() => {
      jest.mocked(mockToast.isActive).mockReturnValue(false);
      jest.mocked(useToast).mockImplementation(() => mockToast);

      received = arrange();
    });

    checkProperties();

    describe("open", () => {
      beforeEach(() =>
        received.result.current.error.open(testField, testMessage)
      );

      it("should generate a new toast", () => {
        expect(mockToast).toBeCalledTimes(1);
        expect(mockToast).toBeCalledWith({
          duration: 1000,
          id: testField,
          isClosable: false,
          status: "error",
          title: testMessage,
        });
        expect(mockToast.isActive).toBeCalledTimes(1);
        expect(mockToast.close).toBeCalledTimes(0);
      });
    });

    describe("close", () => {
      beforeEach(() => received.result.current.error.close(testField));

      it("should NOT close the toast toast", () => {
        expect(mockToast).toBeCalledTimes(0);
        expect(mockToast.isActive).toBeCalledTimes(1);
        expect(mockToast.close).toBeCalledTimes(0);
      });
    });
  });
});
