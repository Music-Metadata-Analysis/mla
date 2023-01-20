import { fireEvent, waitFor } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import mockHookValues from "../__mocks__/navbar.threshold.toggle.hook.mock";
import useNavBarThresholdToggle, {
  UseNavBarThresholdToggleInterface,
} from "../navbar.threshold.toggle.hook";
import mockUseNavBar from "@src/web/navigation/navbar/state/controllers/__mocks__/navbar.controller.hook.mock";

jest.mock(
  "@src/web/navigation/navbar/state/controllers/navbar.controller.hook"
);

describe("useNavBarThresholdToggle", () => {
  let received: ReturnType<typeof arrange>;
  let currentProps: UseNavBarThresholdToggleInterface;

  const mockThreshold = 100;

  const originalWindowHeight = window.innerHeight;

  const baseProps: UseNavBarThresholdToggleInterface = {
    threshold: mockThreshold,
  };

  beforeEach(() => {
    resetScreen();
    resetProps();
    jest.clearAllMocks();
  });

  beforeAll(() => {
    Object.defineProperty(window, "innerHeight", {
      writable: true,
      configurable: true,
    });
  });

  afterAll(() => {
    window.innerHeight = originalWindowHeight;
  });

  const arrange = () => {
    return renderHook(() => useNavBarThresholdToggle(currentProps));
  };

  const resetProps = () => {
    currentProps = { ...baseProps };
  };

  const resetScreen = () => {
    window.innerHeight = mockThreshold - 1;
    window.innerWidth = mockThreshold - 1;
  };

  const checkProperties = () => {
    it("should contain all the same properties as the mock hook", () => {
      expect(received.result.current).toStrictEqual(mockHookValues);
    });
  };

  const checkIsVisible = ({ expectedCalls }: { expectedCalls: number }) => {
    it(`should display the navbar`, async () => {
      await waitFor(() =>
        expect(mockUseNavBar.navigation.setTrue).toBeCalledTimes(expectedCalls)
      );
      for (let i = 1; i < expectedCalls + 1; i++) {
        expect(mockUseNavBar.navigation.setTrue).toHaveBeenNthCalledWith(i);
      }
    });
  };

  const checkIsNotVisible = ({ expectedCalls }: { expectedCalls: number }) => {
    it(`should hide the navbar`, async () => {
      await waitFor(() =>
        expect(mockUseNavBar.navigation.setFalse).toBeCalledTimes(expectedCalls)
      );
      for (let i = 1; i < expectedCalls + 1; i++) {
        expect(mockUseNavBar.navigation.setFalse).toHaveBeenNthCalledWith(i);
      }
    });
  };

  const checkUnmount = () => {
    describe("when unmounted", () => {
      beforeEach(() => {
        mockUseNavBar.navigation.setTrue.mockClear();

        received.unmount();
      });

      it("should set the navbar to the show state", () => {
        expect(mockUseNavBar.navigation.setTrue).toBeCalledTimes(1);
        expect(mockUseNavBar.navigation.setTrue).toBeCalledWith();
      });
    });
  };

  const checkResize = ({
    currentState,
    newValue,
  }: {
    currentState: boolean;
    newValue: number;
  }) => {
    if (currentState == newValue >= baseProps.threshold) return;

    describe(`when the screen innerHeight is changed to ${newValue}`, () => {
      beforeEach(() => {
        window.innerHeight = newValue;

        mockUseNavBar.navigation.setFalse.mockClear();
        mockUseNavBar.navigation.setTrue.mockClear();

        fireEvent.resize(window);
      });

      if (newValue >= baseProps.threshold) checkIsVisible({ expectedCalls: 2 });

      if (newValue < baseProps.threshold)
        checkIsNotVisible({ expectedCalls: 1 });
    });
  };

  const checkResizeAboveAndBelowThreshold = ({
    currentState,
  }: {
    currentState: boolean;
  }) => {
    checkResize({
      currentState,
      newValue: mockThreshold + 1,
    });
    checkResize({
      currentState,
      newValue: mockThreshold - 1,
    });
  };

  describe("when the threshold is matched or exceeded by the window's innerHeight", () => {
    beforeEach(() => {
      window.innerHeight = currentProps.threshold;

      received = arrange();
    });

    checkProperties();
    checkIsVisible({ expectedCalls: 2 });
    checkResizeAboveAndBelowThreshold({ currentState: true });
    checkUnmount();
  });

  describe("when the threshold is not met by the window's innerHeight", () => {
    beforeEach(() => {
      window.innerHeight = currentProps.threshold - 1;

      received = arrange();
    });

    checkProperties();
    checkIsNotVisible({ expectedCalls: 1 });
    checkResizeAboveAndBelowThreshold({ currentState: false });
    checkUnmount();
  });
});
