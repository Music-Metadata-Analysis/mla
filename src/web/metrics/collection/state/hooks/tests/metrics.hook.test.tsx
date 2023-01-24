import { act, waitFor } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import dk from "deep-keys";
import mockHookValues from "../__mocks__/metrics.hook.mock";
import useMetrics from "../metrics.hook";
import { InitialState } from "@src/web/metrics/collection/state/providers/metrics.initial";
import { MetricsContext } from "@src/web/metrics/collection/state/providers/metrics.provider";
import type { MetricsContextInterface } from "@src/web/metrics/collection/types/state/provider.types";
import type { ReactNode } from "react";

interface MockUserContextWithChildren {
  children?: ReactNode;
  mockContext: MetricsContextInterface;
}

describe("useMetrics", () => {
  const mockMetric = "SearchMetric" as const;
  const mockDispatch = jest.fn();
  let received: ReturnType<typeof arrange>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const providerWrapper = ({
    children,
    mockContext,
  }: MockUserContextWithChildren) => {
    return (
      <MetricsContext.Provider value={mockContext}>
        {children}
      </MetricsContext.Provider>
    );
  };

  const arrange = (providerProps: MetricsContextInterface) => {
    return renderHook(() => useMetrics(), {
      wrapper: providerWrapper,
      initialProps: {
        mockContext: providerProps,
      },
    });
  };

  describe("is rendered", () => {
    beforeEach(() => {
      received = arrange({
        metrics: { ...InitialState },
        dispatch: mockDispatch,
      });
    });

    it("should contain the correct properties", () => {
      expect(received.result.current.metrics).toStrictEqual(InitialState);
    });

    it("should contain the correct functions", () => {
      expect(received.result.current.increment).toBeInstanceOf(Function);
    });

    it("should contain all the same properties as the mock hook", () => {
      const mockObjectKeys = dk(mockHookValues).sort();
      const hookKeys = dk(received.result.current).sort();
      expect(hookKeys).toStrictEqual(mockObjectKeys);
    });
  });

  describe("increment", () => {
    it("should dispatch the reducer correctly", async () => {
      act(() => received.result.current.increment(mockMetric));
      await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
      expect(mockDispatch).toHaveBeenCalledWith({
        type: mockMetric,
      });
    });
  });
});
