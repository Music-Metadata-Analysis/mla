import { act, renderHook } from "@testing-library/react-hooks";
import dk from "deep-keys";
import useSunBurstState from "../sunburst.report.layout.hook";
import mockHookValues from "@src/components/reports/lastfm/common/sunburst.report/layout/__mocks__/sunburst.report.layout.hook.mock";

describe("mockUseSunBurstState", () => {
  let received: ReturnType<typeof arrange>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    return renderHook(() => useSunBurstState());
  };

  describe("when rendered", () => {
    beforeEach(() => {
      received = arrange();
    });

    it("should contain the correct setter functions", () => {
      expect(received.result.current.setters.setCurrentLayout).toBeInstanceOf(
        Function
      );
      expect(received.result.current.setters.setFitsOnScreen).toBeInstanceOf(
        Function
      );
    });

    it("should contain the correct getters with sane defaults", () => {
      expect(received.result.current.getters.currentLayout).toBe("normal");
      expect(received.result.current.getters.fitsOnScreen).toBe(true);
    });

    it("should contain the correct sections with sane defaults", () => {
      expect(received.result.current.sections.info).toStrictEqual({
        current: null,
      });
      expect(received.result.current.sections.chart).toStrictEqual({
        current: null,
      });
    });

    describe("setCurrentLayout", () => {
      beforeEach(() => {
        act(() => received.result.current.setters.setCurrentLayout("wide"));
      });

      it("should update the correct getter", () => {
        expect(received.result.current.getters.currentLayout).toBe("wide");
      });
    });

    describe("setFitsOnScreen", () => {
      beforeEach(() => {
        act(() => received.result.current.setters.setFitsOnScreen(false));
      });

      it("should update the correct getter", () => {
        expect(received.result.current.getters.fitsOnScreen).toBe(false);
      });
    });

    it("should contain all the same properties as the mock hook", () => {
      const mockObjectKeys = dk(mockHookValues).sort();
      const hookKeys = dk(received.result.current).sort();
      expect(hookKeys).toStrictEqual(mockObjectKeys);
    });
  });
});
