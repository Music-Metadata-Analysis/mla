import { act, renderHook } from "@testing-library/react-hooks";
import dk from "deep-keys";
import { useRef } from "react";
import useSunBurstLayoutController, {
  SunBurstLayoutFlexProps,
} from "../sunburst.report.layout.controller.hook";
import {
  calculateCanFitOnScreen,
  calculateLayoutType,
} from "../sunburst.report.layout.controller.utility";
import mockHookValues from "@src/web/reports/lastfm/generics/components/report.component/sunburst/controllers/__mocks__/sunburst.report.layout.controller.hook.mock";

jest.mock("../sunburst.report.layout.controller.utility", () => ({
  calculateCanFitOnScreen: jest.fn(),
  calculateLayoutType: jest.fn(),
}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useRef: jest.fn(),
}));

describe("useSunBurstLayoutController", () => {
  let received: ReturnType<typeof arrange>;
  const mockRef1 = { current: null, value: 1 };
  const mockRef2 = { current: null, value: 2 };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    defaults();
    return renderHook(() => useSunBurstLayoutController());
  };

  const defaults = () => {
    jest
      .mocked(useRef)
      .mockImplementationOnce(() => mockRef1)
      .mockImplementationOnce(() => mockRef2);
    jest.mocked(calculateCanFitOnScreen).mockReturnValueOnce(true);
    jest.mocked(calculateLayoutType).mockReturnValueOnce("normal");
  };

  const checkLayoutFunctionCalls = () => {
    it("should call calculateCanFitOnScreen", () => {
      expect(calculateCanFitOnScreen).toBeCalledTimes(1);
      expect(calculateCanFitOnScreen).toBeCalledWith();
    });

    it("should call calculateLayoutType", () => {
      expect(calculateLayoutType).toBeCalledTimes(1);
      expect(calculateLayoutType).toBeCalledWith(mockRef1, mockRef2);
    });
  };

  const checkCanFitOnScreenProp = ({ expected }: { expected: boolean }) => {
    it(`should make the canFitOnScreen prop '${expected}'`, () => {
      expect(received.result.current.canFitOnScreen).toBe(expected);
    });
  };

  const checkNormalLayoutProps = () => {
    it("should make the flexProps props the expected value", () => {
      expect(received.result.current.flexProps).toStrictEqual(
        SunBurstLayoutFlexProps["normal"]
      );
    });
  };

  const checkCompactLayoutProps = () => {
    it("should make the flexProps props the expected value", () => {
      expect(received.result.current.flexProps).toStrictEqual(
        SunBurstLayoutFlexProps["compact"]
      );
    });
  };

  describe("when rendered", () => {
    beforeEach(() => {
      received = arrange();

      jest.clearAllMocks();
    });

    it("should contain all the same properties as the mock hook", () => {
      const mockObjectKeys = dk(mockHookValues).sort();
      const hookKeys = dk(received.result.current).sort();
      expect(hookKeys).toStrictEqual(mockObjectKeys);
    });

    it("should contain the correct functions", () => {
      expect(received.result.current.update).toBeInstanceOf(Function);
    });

    it("should contain the correct defaults", () => {
      expect(received.result.current.canFitOnScreen).toBe(true);
      expect(received.result.current.flexProps).toStrictEqual(
        SunBurstLayoutFlexProps["normal"]
      );
    });

    it("should contain the correct default ref objects", () => {
      expect(received.result.current.ref.info).toStrictEqual(mockRef1);
      expect(received.result.current.ref.chart).toStrictEqual(mockRef2);
    });

    describe("when calculateCanFitOnScreen returns 'true'", () => {
      beforeEach(() =>
        jest.mocked(calculateCanFitOnScreen).mockReturnValueOnce(true)
      );

      describe("when calculateLayoutType returns 'normal'", () => {
        beforeEach(() =>
          jest.mocked(calculateLayoutType).mockReturnValueOnce("normal")
        );

        describe("update", () => {
          beforeEach(
            async () => await act(async () => received.result.current.update())
          );

          checkLayoutFunctionCalls();
          checkCanFitOnScreenProp({ expected: true });
          checkNormalLayoutProps();
        });
      });

      describe("when calculateLayoutType returns 'compact'", () => {
        beforeEach(() =>
          jest.mocked(calculateLayoutType).mockReturnValueOnce("compact")
        );

        describe("update", () => {
          beforeEach(
            async () => await act(async () => received.result.current.update())
          );

          checkLayoutFunctionCalls();
          checkCanFitOnScreenProp({ expected: true });
          checkCompactLayoutProps();
        });
      });
    });

    describe("when calculateCanFitOnScreen returns 'false'", () => {
      beforeEach(() =>
        jest.mocked(calculateCanFitOnScreen).mockReturnValueOnce(false)
      );

      describe("when calculateLayoutType returns 'normal'", () => {
        beforeEach(() =>
          jest.mocked(calculateLayoutType).mockReturnValueOnce("normal")
        );

        describe("update", () => {
          beforeEach(
            async () => await act(async () => received.result.current.update())
          );

          checkLayoutFunctionCalls();
          checkCanFitOnScreenProp({ expected: false });
          checkNormalLayoutProps();
        });
      });

      describe("when calculateLayoutType returns 'compact'", () => {
        beforeEach(() =>
          jest.mocked(calculateLayoutType).mockReturnValueOnce("compact")
        );

        describe("update", () => {
          beforeEach(
            async () => await act(async () => received.result.current.update())
          );

          checkLayoutFunctionCalls();
          checkCanFitOnScreenProp({ expected: false });
          checkCompactLayoutProps();
        });
      });
    });
  });
});
