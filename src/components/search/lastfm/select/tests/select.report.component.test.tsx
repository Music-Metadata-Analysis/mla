// @ts-ignore: mocked with forwardRef
import { BoxWithRef, Flex, Avatar } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import Option from "../inlay/select.option.component";
import Select from "../select.report.component";
import translations from "@locales/lastfm.json";
import Billboard from "@src/components/billboard/billboard.component";
import LastFMIcon from "@src/components/icons/lastfm/lastfm.icon";
import VerticalScrollBarComponent from "@src/components/scrollbar/vertical.scrollbar.component";
import config from "@src/config/lastfm";
import settings from "@src/config/navbar";
import mockUseFlags from "@src/hooks/__mocks__/flags.mock";
import { MockUseLocale, _t } from "@src/hooks/__mocks__/locale.mock";
import checkMockCall from "@src/tests/fixtures/mock.component.call";
import type { MutableRefObject } from "react";

jest.mock("@src/hooks/flags");

jest.mock("@src/hooks/locale");

jest.mock("@src/hooks/router");

jest.mock("@chakra-ui/react", () => {
  const { createChakraMock } = require("@fixtures/chakra");
  const chakraMock = createChakraMock(["Avatar", "Flex"], ["Box"]);
  return chakraMock;
});

jest.mock("@src/components/billboard/billboard.component", () =>
  require("@fixtures/react/parent").createComponent("Billboard")
);

jest.mock("../inlay/select.option.component", () =>
  require("@fixtures/react/parent").createComponent("Option")
);

jest.mock("@src/components/scrollbar/vertical.scrollbar.component", () =>
  require("@fixtures/react/parent").createComponent(
    "VerticalScrollBarComponent"
  )
);

jest.mock("@src/components/icons/lastfm/lastfm.icon", () =>
  require("@fixtures/react/child").createComponent("Icon")
);

describe("SearchSelection", () => {
  const mockRef = {
    current: { mock: "div" },
  } as unknown as MutableRefObject<HTMLDivElement | null>;
  const mockT = new MockUseLocale("lastfm");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const actRender = () => {
    render(<Select scrollRef={mockRef} />);
  };

  const checkChakraComponents = () => {
    it("should call Billboard with the correct props", () => {
      checkMockCall(Billboard, { title: _t(translations.select.title) }, 0, []);
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
          id: "SunburstDrawerEntityListScrollArea",
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
      expect(renderToString(call.icon!)).toBe(renderToString(<LastFMIcon />));
      expect(Object.keys(call).length).toBe(2);
    });

    it("should call VerticalScrollBarComponent as expected", () => {
      expect(VerticalScrollBarComponent).toBeCalledTimes(1);
      checkMockCall(
        VerticalScrollBarComponent,
        {
          horizontalOffset: 0,
          scrollRef: mockRef,
          update: mockRef.current,
          verticalOffset: 0,
        },
        0
      );
    });
  };

  const checkFlagsForOptions = (expectedCount: number) => {
    it(`should render an Option for each flag-enabled report, (${expectedCount} times)`, () => {
      expect(Option).toBeCalledTimes(expectedCount);
      jest.mocked(Option).mock.calls.forEach((mockCall, index) => {
        const call = mockCall[0];
        expect(typeof call.clickHandler).toBe("function");
        expect(call.analyticsName).toBe(
          config.select.options[index].analyticsName
        );
        expect(call.buttonText).toBe(
          mockT.t(config.select.options[index].buttonTextKey)
        );
        expect(call.indicatorText).toBe(
          mockT.t(config.select.options[index].indicatorTextKey)
        );
        expect(call.visibleIndicators).toBe(true);
        expect(Object.keys(call).length).toBe(5);
      });
    });
  };

  const checkFlagIsEnabledCalls = () => {
    it(`should call the isEnabled hook function as expected`, () => {
      const configuredFlags = config.select.options;

      expect(mockUseFlags.isEnabled).toBeCalledTimes(configuredFlags.length);
      mockUseFlags.isEnabled.mock.calls.forEach((mockCall, index) => {
        const call = mockCall;
        expect(call).toEqual([configuredFlags[index].flag]);
      });
    });
  };

  describe(`when a flag is disabled`, () => {
    beforeEach(() => {
      mockUseFlags.isEnabled
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(false);
    });

    describe("when rendered", () => {
      beforeEach(() => {
        actRender();
      });

      checkChakraComponents();

      checkFlagIsEnabledCalls();

      checkFlagsForOptions(3);
    });
  });

  describe(`when all flags are enabled`, () => {
    beforeEach(() => {
      mockUseFlags.isEnabled
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(true);
    });

    describe("when rendered", () => {
      beforeEach(() => {
        actRender();
      });

      checkChakraComponents();

      checkFlagIsEnabledCalls();

      checkFlagsForOptions(4);
    });
  });
});
