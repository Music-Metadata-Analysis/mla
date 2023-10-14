import { renderHook } from "@testing-library/react-hooks";
import dk from "deep-keys";
import mockAnalyticsCollectionHook from "../__mocks__/analytics.hook.mock";
import useAnalytics from "../analytics.hook";
import { analyticsVendor } from "@src/vendors/integrations/analytics/vendor";

jest.mock("@src/vendors/integrations/analytics/vendor");

describe("useAnalytics", () => {
  let received: ReturnType<typeof arrange>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    return renderHook(() => useAnalytics());
  };

  describe("when rendered", () => {
    beforeEach(() => {
      received = arrange();
    });

    it("should contain all the same properties as the mock colour hook", () => {
      const mockObjectKeys = dk(mockAnalyticsCollectionHook).sort();
      const hookKeys = dk(
        received.result.current as unknown as Record<string, unknown>
      ).sort();
      expect(hookKeys).toStrictEqual(mockObjectKeys);
    });

    it("should call the underlying vendor hook during render", () => {
      expect(analyticsVendor.collection.hook).toBeCalledTimes(1);
      expect(analyticsVendor.collection.hook).toBeCalledWith(
        analyticsVendor.ClientClass
      );
    });

    it("should return the vendor hook", () => {
      expect(received.result.current).toBe(mockAnalyticsCollectionHook);
    });
  });
});
