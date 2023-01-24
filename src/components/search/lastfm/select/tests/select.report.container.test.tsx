// @ts-ignore: mocked with forwardRef
import { render } from "@testing-library/react";
import { useRef } from "react";
import ReportSelect, { ReportSelectProps } from "../select.report.component";
import ReportSelectContainer from "../select.report.container";
import translations from "@locales/lastfm.json";
import config from "@src/config/lastfm";
import mockUseWindowThreshold from "@src/hooks/ui/__mocks__/window.threshold.hook.mock";
import useWindowThreshold from "@src/hooks/ui/window.threshold.hook";
import { mockUseRouter } from "@src/vendors/integrations/web.framework/__mocks__/vendor.mock";
import {
  MockUseTranslation,
  _t,
} from "@src/web/locale/translation/hooks/__mocks__/translation.hook.mock";
import mockUseFlags from "@src/web/runtime/feature.flags/hooks/__mocks__/flags.hook.mock";
import type { MutableRefObject } from "react";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useRef: jest.fn(),
}));

jest.mock("@src/web/runtime/feature.flags/hooks/flags.hook");

jest.mock("@src/web/locale/translation/hooks/translation.hook");

jest.mock("@src/web/navigation/routing/hooks/router.hook");

jest.mock("@src/hooks/ui/window.threshold.hook");

jest.mock("../select.report.component", () =>
  require("@fixtures/react/child").createComponent("ReportSelect")
);

describe("ReportSelectContainer", () => {
  const mockScrollRef = {
    current: { mock: "div" },
  } as unknown as MutableRefObject<HTMLDivElement | null>;

  const mockT = new MockUseTranslation("lastfm").t;

  beforeEach(() => {
    jest.clearAllMocks();

    jest.mocked(useRef).mockReturnValueOnce(mockScrollRef);
  });

  const arrange = () => {
    render(<ReportSelectContainer />);
  };

  const checkWindowThresholdHookRender = () => {
    it("should render the useWindowThreshold hook with the correct props", () => {
      expect(useWindowThreshold).toBeCalledTimes(1);
      expect(useWindowThreshold).toBeCalledWith({
        axis: "innerWidth",
        lowState: false,
        threshold: config.select.indicatorWidth,
      });
    });
  };

  const checkSelectComponentRender = (reports: Array<boolean>) => {
    describe("when rendered with this set of flags", () => {
      let enabledReports: typeof config.select.options;

      beforeEach(() => {
        enabledReports = config.select.options.filter(
          (_, index) => reports[index]
        );

        arrange();
      });

      checkWindowThresholdHookRender();

      it("should render the ReportSelect component with props that include only the enabled reports", () => {
        expect(ReportSelect).toBeCalledTimes(1);

        jest.mocked(ReportSelect).mock.calls.forEach((call) => {
          expect(call[0].scrollRef).toBe(mockScrollRef);
          expect(call[0].titleText).toBe(_t(translations.select.title));

          call[0].reportOptionProps.forEach((renderedProps, index) => {
            expect(Object.keys(renderedProps).length).toBe(5);

            expect(renderedProps.analyticsName).toEqual(
              enabledReports[index].analyticsName
            );
            expect(renderedProps.buttonText).toEqual(
              mockT(enabledReports[index].buttonTextKey)
            );
            expect(renderedProps.indicatorText).toEqual(
              mockT(enabledReports[index].indicatorTextKey)
            );
            expect(renderedProps.displayIndicator).toEqual(
              mockUseWindowThreshold.state
            );

            expect(renderedProps.clickHandler).toBeDefined();
          });
        });
      });

      describe("when the rendered clickHandler is called on each ReportOption prop that was passed", () => {
        let renderedReportOptionProps: ReportSelectProps["reportOptionProps"];

        beforeEach(
          () =>
            (renderedReportOptionProps =
              jest.mocked(ReportSelect).mock.calls[0][0].reportOptionProps)
        );

        it("should route to the correct report page", () => {
          renderedReportOptionProps.forEach((renderedProps) => {
            const matchingReport = config.select.options.find(
              (option) => option.analyticsName === renderedProps.analyticsName
            );

            mockUseRouter.push.mockClear();

            renderedProps.clickHandler();

            expect(mockUseRouter.push).toBeCalledTimes(1);
            expect(mockUseRouter.push).toBeCalledWith(matchingReport?.route);
          });
        });
      });
    });
  };

  describe("when the window threshold is high", () => {
    beforeEach(() => (mockUseWindowThreshold.state = true));

    describe("when a flag is disabled", () => {
      beforeEach(() => {
        mockUseFlags.isEnabled
          .mockReturnValueOnce(true)
          .mockReturnValueOnce(true)
          .mockReturnValueOnce(true)
          .mockReturnValueOnce(false);
      });

      checkSelectComponentRender([true, true, true, false]);
    });

    describe("when all flags are enabled", () => {
      beforeEach(() => {
        mockUseFlags.isEnabled
          .mockReturnValueOnce(true)
          .mockReturnValueOnce(true)
          .mockReturnValueOnce(true)
          .mockReturnValueOnce(true);
      });

      checkSelectComponentRender([true, true, true, true]);
    });
  });

  describe("when the window threshold is low", () => {
    beforeEach(() => (mockUseWindowThreshold.state = false));

    describe("when a flag is disabled", () => {
      beforeEach(() => {
        mockUseFlags.isEnabled
          .mockReturnValueOnce(true)
          .mockReturnValueOnce(true)
          .mockReturnValueOnce(true)
          .mockReturnValueOnce(false);
      });

      checkSelectComponentRender([true, true, true, false]);
    });

    describe("when all flags are enabled", () => {
      beforeEach(() => {
        mockUseFlags.isEnabled
          .mockReturnValueOnce(true)
          .mockReturnValueOnce(true)
          .mockReturnValueOnce(true)
          .mockReturnValueOnce(true);
      });

      checkSelectComponentRender([true, true, true, true]);
    });
  });
});
