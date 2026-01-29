import { fireEvent, waitFor } from "@testing-library/react";
import { renderHook } from "@testing-library/react";
import dk from "deep-keys";
import mockHookValues from "../__mocks__/window.threshold.hook.mock";
import useWindowThreshold from "../window.threshold.hook";
import type { UseWindowThresholdInterface } from "../window.threshold.hook";

describe("useWindowThreshold", () => {
  let received: ReturnType<typeof arrange>;
  let currentProps: UseWindowThresholdInterface;

  const mockThreshold = 100;

  const originalWindowHeight = window.innerHeight;
  const originalWindowWidth = window.innerWidth;

  const baseProps: UseWindowThresholdInterface = {
    lowState: true,
    axis: "innerHeight",
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
    return renderHook(() => useWindowThreshold(currentProps));
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
    lowState,
    newValue,
    axis,
  }: {
    lowState: boolean;
    newValue: number;
    axis: UseWindowThresholdInterface["axis"];
  }) => {
    describe(`when the screen ${axis} is changed to ${newValue}`, () => {
      beforeEach(() => {
        window[axis] = newValue;

        fireEvent.resize(window);
      });

      checkState({ expectedState: lowState });
    });
  };

  const checkResizeAboveAndBelowThreshold = ({
    lowState,
    axis,
  }: {
    lowState: boolean;
    axis: UseWindowThresholdInterface["axis"];
  }) => {
    checkResize({
      lowState: !lowState,
      newValue: mockThreshold + 1,
      axis,
    });
    checkResize({
      lowState: lowState,
      newValue: mockThreshold - 1,
      axis,
    });
  };

  const checkResizeOtherParameter = ({
    currentState,
    axis,
  }: {
    currentState: boolean;
    axis: UseWindowThresholdInterface["axis"];
  }) => {
    checkResize({
      lowState: currentState,
      newValue: mockThreshold + 1,
      axis,
    });
    checkResize({
      lowState: currentState,
      newValue: mockThreshold - 1,
      axis,
    });
  };

  describe("with the default lowState value", () => {
    beforeEach(() => {
      currentProps.lowState = undefined;
    });

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
          lowState: false,
          axis: "innerWidth",
        });
        checkResizeOtherParameter({
          currentState: true,
          axis: "innerHeight",
        });
      });

      describe("when the threshold is not met", () => {
        beforeEach(() => {
          window[currentProps.axis] = currentProps.threshold - 1;

          received = arrange();
        });

        checkProperties();
        checkState({ expectedState: false });

        checkResizeAboveAndBelowThreshold({
          lowState: false,
          axis: "innerWidth",
        });
        checkResizeOtherParameter({
          currentState: false,
          axis: "innerHeight",
        });
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
          lowState: false,
          axis: "innerHeight",
        });
        checkResizeOtherParameter({
          currentState: true,
          axis: "innerWidth",
        });
      });

      describe("when the threshold is not met", () => {
        beforeEach(() => {
          window[currentProps.axis] = currentProps.threshold - 1;

          received = arrange();
        });

        checkProperties();
        checkState({ expectedState: false });

        checkResizeAboveAndBelowThreshold({
          lowState: false,
          axis: "innerHeight",
        });
        checkResizeOtherParameter({
          currentState: false,
          axis: "innerWidth",
        });
      });
    });
  });

  describe("with a lowState value of false", () => {
    beforeEach(() => {
      currentProps.lowState = false;
    });

    describe("when the axis is set to innerWidth", () => {
      beforeEach(() => {
        currentProps.axis = "innerWidth";
      });

      describe("when the axis is matched or exceeded", () => {
        beforeEach(() => {
          window[currentProps.axis] = currentProps.threshold;

          received = arrange();
        });

        checkProperties();
        checkState({ expectedState: true });

        checkResizeAboveAndBelowThreshold({
          lowState: false,
          axis: "innerWidth",
        });
        checkResizeOtherParameter({
          currentState: true,
          axis: "innerHeight",
        });
      });

      describe("when the threshold is not met", () => {
        beforeEach(() => {
          window[currentProps.axis] = currentProps.threshold - 1;

          received = arrange();
        });

        checkProperties();
        checkState({ expectedState: false });

        checkResizeAboveAndBelowThreshold({
          lowState: false,
          axis: "innerWidth",
        });
        checkResizeOtherParameter({
          currentState: false,
          axis: "innerHeight",
        });
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
          lowState: false,
          axis: "innerHeight",
        });
        checkResizeOtherParameter({
          currentState: true,
          axis: "innerWidth",
        });
      });

      describe("when the threshold is not met", () => {
        beforeEach(() => {
          window[currentProps.axis] = currentProps.threshold - 1;

          received = arrange();
        });

        checkProperties();
        checkState({ expectedState: false });

        checkResizeAboveAndBelowThreshold({
          lowState: false,
          axis: "innerHeight",
        });
        checkResizeOtherParameter({
          currentState: false,
          axis: "innerWidth",
        });
      });
    });
  });

  describe("with a lowState value of true", () => {
    beforeEach(() => {
      currentProps.lowState = true;
    });

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
        checkState({ expectedState: false });

        checkResizeAboveAndBelowThreshold({
          lowState: true,
          axis: "innerWidth",
        });
        checkResizeOtherParameter({
          currentState: false,
          axis: "innerHeight",
        });
      });

      describe("when the threshold is not met", () => {
        beforeEach(() => {
          window[currentProps.axis] = currentProps.threshold - 1;

          received = arrange();
        });

        checkProperties();
        checkState({ expectedState: true });

        checkResizeAboveAndBelowThreshold({
          lowState: true,
          axis: "innerWidth",
        });
        checkResizeOtherParameter({
          currentState: true,
          axis: "innerHeight",
        });
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
        checkState({ expectedState: false });

        checkResizeAboveAndBelowThreshold({
          lowState: true,
          axis: "innerHeight",
        });
        checkResizeOtherParameter({
          currentState: false,
          axis: "innerWidth",
        });
      });

      describe("when the threshold is not met", () => {
        beforeEach(() => {
          window[currentProps.axis] = currentProps.threshold - 1;

          received = arrange();
        });

        checkProperties();
        checkState({ expectedState: true });

        checkResizeAboveAndBelowThreshold({
          lowState: true,
          axis: "innerHeight",
        });
        checkResizeOtherParameter({
          currentState: true,
          axis: "innerWidth",
        });
      });
    });
  });
});
