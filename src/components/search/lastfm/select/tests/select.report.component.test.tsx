// @ts-ignore: mocked with forwardRef
import { BoxWithRef, Flex, Avatar } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import Option from "../option/report.option.component";
import ReportSelect, { ReportSelectProps } from "../select.report.component";
import { ids } from "../select.report.identifiers";
import BillboardContainer from "@src/components/billboard/billboard.base/billboard.container";
import LastFMIconContainer from "@src/components/icons/lastfm/lastfm.icon.container";
import VerticalScrollBarContainer from "@src/components/scrollbars/vertical/vertical.scrollbar.container";
import settings from "@src/config/navbar";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";

jest.mock("@chakra-ui/react", () =>
  require("@fixtures/chakra").createChakraMock(["Avatar", "Flex"], ["Box"])
);

jest.mock("@src/components/billboard/billboard.base/billboard.container", () =>
  require("@fixtures/react/parent").createComponent("BillboardContainer")
);

jest.mock("../option/report.option.component", () =>
  require("@fixtures/react/parent").createComponent("ReportOption")
);

jest.mock(
  "@src/components/scrollbars/vertical/vertical.scrollbar.container",
  () =>
    require("@fixtures/react/parent").createComponent(
      "VerticalScrollBarContainer"
    )
);

jest.mock("@src/components/icons/lastfm/lastfm.icon.container", () =>
  require("@fixtures/react/child").createComponent("LastFMIconContainer")
);

describe("SearchSelection", () => {
  let currentProps: ReportSelectProps;

  const mockRef = {
    current: null,
    value: "mocked",
  };

  const generateMockReportOption = (key: number, display: boolean) => ({
    analyticsName: `analyticsName${key}`,
    buttonText: `buttonText${key}`,
    clickHandler: jest.fn(),
    indicatorText: `indicatorText${key}`,
    displayIndicator: display,
  });

  const baseProps: ReportSelectProps = {
    reportOptionProps: [generateMockReportOption(1, true)],
    scrollRef: mockRef,
    titleText: "mockTitleText",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    resetProps();
  });

  const arrange = () => {
    render(<ReportSelect {...currentProps} />);
  };

  const resetProps = () => {
    currentProps = { ...baseProps };
  };

  const checkChakraComponents = () => {
    it("should call Billboard with the correct props", () => {
      checkMockCall(
        BillboardContainer,
        { titleText: currentProps.titleText },
        0,
        []
      );
    });

    it("should call Flex as expected to center content", () => {
      expect(Flex).toBeCalledTimes(2);
      checkMockCall(Flex, { align: "center", justify: "space-evenly" }, 0);
      checkMockCall(
        Flex,
        {
          align: "center",
          direction: "column",
          justify: "center",
          mb: 2,
        },
        1
      );
    });

    it("should call Box as expected to create a margin around the form", () => {
      expect(BoxWithRef).toBeCalledTimes(3);
      checkMockCall(BoxWithRef, { position: "relative" }, 0);
      checkMockCall(BoxWithRef, { mb: 1 }, 1);
      checkMockCall(
        BoxWithRef,
        {
          className: "scrollbar",
          id: ids.LastFMReportSelectScrollArea,
          maxHeight: `calc(100vh - ${settings.offset}px)`,
          overflow: "scroll",
          position: "relative",
        },
        2
      );
    });

    it("should call Avatar as expected to display the logo", () => {
      expect(Avatar).toBeCalledTimes(1);
      const call = jest.mocked(Avatar).mock.calls[0][0];
      expect(call.width).toStrictEqual([50, 50, 75]);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(renderToString(call.icon!)).toBe(
        renderToString(<LastFMIconContainer />)
      );
      expect(Object.keys(call).length).toBe(2);
    });

    it("should call VerticalScrollBarComponent as expected", () => {
      expect(VerticalScrollBarContainer).toBeCalledTimes(1);
      checkMockCall(
        VerticalScrollBarContainer,
        {
          horizontalOffset: 0,
          scrollRef: currentProps.scrollRef,
          update: currentProps.scrollRef.current,
          verticalOffset: 0,
        },
        0
      );
    });
  };

  const checkReportOptionRenders = () => {
    it("should render an Option for each configured reportOptionProp", () => {
      expect(Option).toBeCalledTimes(currentProps.reportOptionProps.length);

      (
        currentProps.reportOptionProps as unknown[] as Record<string, unknown>[]
      ).forEach((optionProp, index) => {
        checkMockCall(Option, optionProp, index);
      });
    });
  };

  describe("with the label visibility indicator set to true", () => {
    const displayIndicator = true;

    describe("with a set of enabled reports", () => {
      beforeEach(() => {
        currentProps.reportOptionProps = [
          generateMockReportOption(1, displayIndicator),
          generateMockReportOption(2, displayIndicator),
          generateMockReportOption(3, displayIndicator),
        ];

        arrange();
      });

      checkChakraComponents();
      checkReportOptionRenders();
    });
  });

  describe("with the label visibility indicator set to false", () => {
    const displayIndicator = false;

    describe("with a different set of enabled reports", () => {
      beforeEach(() => {
        currentProps.reportOptionProps = [
          generateMockReportOption(1, displayIndicator),
          generateMockReportOption(2, displayIndicator),
          generateMockReportOption(3, displayIndicator),
          generateMockReportOption(4, displayIndicator),
          generateMockReportOption(5, displayIndicator),
        ];

        arrange();
      });

      checkChakraComponents();
      checkReportOptionRenders();
    });
  });
});
