import { fireEvent, waitFor } from "@testing-library/react";
import { renderHook } from "@testing-library/react";
import dk from "deep-keys";
import mockHookValues from "../__mocks__/window.threshold.callback.hook.mock";
import useWindowThresholdCallback, {
  UseWindowThresholdCallbackInterface,
} from "../window.threshold.callback.hook";

describe("useWindowThresholdCallback", () => {
  let received: ReturnType<typeof arrange>;
  let currentProps: UseWindowThresholdCallbackInterface;

  const mockThreshold = 100;
  const mockOnChange = jest.fn();
  const mockOnUnmount = jest.fn();

  const originalWindowHeight = window.innerHeight;
  const originalWindowWidth = window.innerWidth;

  const baseProps: UseWindowThresholdCallbackInterface = {
    axis: "innerHeight",
    onChange: mockOnChange,
    onUnmount: mockOnUnmount,
    threshold: mockThreshold,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    resetScreen();
    resetProps();
  });

  beforeAll(() => {
    Object.defineProperty(window, "innerHeight", {
      writable: true,
      configurable: true,
    });
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
    });
  });

  afterAll(() => {
    window.innerHeight = originalWindowHeight;
    window.innerWidth = originalWindowWidth;
  });

  const arrange = () => {
    return renderHook(() => useWindowThresholdCallback(currentProps));
  };

  const resetProps = () => {
    currentProps = { ...baseProps };
  };

  const resetScreen = () => {
    window.innerHeight = mockThreshold - 1;
    window.innerWidth = mockThreshold - 1;
  };

  const checkChange = () => {
    it("should call the onChange callback with the expected props", async () => {
      await waitFor(() => expect(currentProps.onChange).toBeCalledTimes(1));
      expect(currentProps.onChange).toBeCalledWith(
        received.result.current.state
      );
    });
  };

  const checkProperties = () => {
    it("should contain all the same properties as the mock hook", () => {
      const mockObjectKeys = dk(mockHookValues).sort();
      const hookKeys = dk(received.result.current).sort();
      expect(hookKeys).toStrictEqual(mockObjectKeys);
    });
  };

  const checkState = ({ expectedState }: { expectedState: boolean }) => {
    it(`should set state to ${expectedState}`, async () => {
      await waitFor(() =>
        expect(received.result.current.state).toBe(expectedState)
      );
    });
  };

  const checkResize = ({
    axis,
    currentState,
    newState,
    newValue,
  }: {
    axis: UseWindowThresholdCallbackInterface["axis"];
    currentState: boolean;
    newState: boolean;
    newValue: number;
  }) => {
    describe(`when the screen ${axis} is changed to ${newValue}`, () => {
      beforeEach(() => {
        jest.mocked(mockOnChange).mockClear();
        window[axis] = newValue;

        fireEvent.resize(window);
      });

      checkState({ expectedState: newState });

      if (newState !== currentState) checkChange();
    });
  };

  const checkResizeAboveAndBelowThreshold = ({
    axis,
    currentState,
  }: {
    axis: UseWindowThresholdCallbackInterface["axis"];
    currentState: boolean;
  }) => {
    checkResize({
      axis,
      currentState,
      newState: true,
      newValue: mockThreshold + 1,
    });

    checkResize({
      axis,
      currentState,
      newState: false,
      newValue: mockThreshold - 1,
    });
  };

  const checkResizeOtherParameter = ({
    currentState,
    axis,
  }: {
    currentState: boolean;
    axis: UseWindowThresholdCallbackInterface["axis"];
  }) => {
    checkResize({
      axis,
      currentState,
      newState: currentState,
      newValue: mockThreshold + 1,
    });
    checkResize({
      axis,
      currentState,
      newState: currentState,
      newValue: mockThreshold - 1,
    });
  };

  const checkUnmount = () => {
    describe("when unmounted", () => {
      beforeEach(() => {
        jest.mocked(currentProps.onUnmount).mockClear();

        received.unmount();
      });

      it("should call the onUnmount callback with the expected props", () => {
        expect(currentProps.onUnmount).toBeCalledTimes(1);
        expect(currentProps.onUnmount).toBeCalledWith();
      });
    });
  };

  describe("when the axis is set to innerWidth", () => {
    beforeEach(() => {
      currentProps.axis = "innerWidth";
    });

    describe("when the threshold is matched or exceeded", () => {
      beforeEach(() => {
        window[currentProps.axis] = currentProps.threshold;

        received = arrange();
      });

      checkProperties();
      checkState({ expectedState: true });

      checkResizeAboveAndBelowThreshold({
        axis: "innerWidth",
        currentState: true,
      });
      checkResizeOtherParameter({
        axis: "innerHeight",
        currentState: true,
      });

      checkUnmount();
    });

    describe("when the threshold is not met", () => {
      beforeEach(() => {
        window[currentProps.axis] = currentProps.threshold - 1;

        received = arrange();
      });

      checkProperties();
      checkState({ expectedState: false });

      checkResizeAboveAndBelowThreshold({
        axis: "innerWidth",
        currentState: false,
      });
      checkResizeOtherParameter({
        axis: "innerHeight",
        currentState: false,
      });

      checkUnmount();
    });
  });

  describe("when the axis is set to innerHeight", () => {
    beforeEach(() => {
      currentProps.axis = "innerHeight";
    });

    describe("when the threshold is matched or exceeded", () => {
      beforeEach(() => {
        window[currentProps.axis] = currentProps.threshold;

        received = arrange();
      });

      checkProperties();
      checkState({ expectedState: true });

      checkResizeAboveAndBelowThreshold({
        axis: "innerHeight",
        currentState: true,
      });
      checkResizeOtherParameter({
        currentState: true,
        axis: "innerWidth",
      });

      checkUnmount();
    });

    describe("when the threshold is not met", () => {
      beforeEach(() => {
        window[currentProps.axis] = currentProps.threshold - 1;

        received = arrange();
      });

      checkProperties();
      checkState({ expectedState: false });

      checkResizeAboveAndBelowThreshold({
        axis: "innerHeight",
        currentState: false,
      });
      checkResizeOtherParameter({
        axis: "innerWidth",
        currentState: false,
      });

      checkUnmount();
    });
  });
});
