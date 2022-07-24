// @ts-ignore: mocked with forwardRef
import { MockedBox, Flex, Avatar } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import { useFlags } from "flagsmith/react";
import { renderToString } from "react-dom/server";
import translations from "../../../../../../public/locales/en/lastfm.json";
import flags from "../../../../../config/flags";
import config from "../../../../../config/lastfm";
import settings from "../../../../../config/navbar";
import checkMockCall from "../../../../../tests/fixtures/mock.component.call";
import translationKeyLookup from "../../../../../tests/fixtures/mock.translation";
import Billboard from "../../../../billboard/billboard.component";
import LastFMIcon from "../../../../icons/lastfm/lastfm.icon";
import VerticalScrollBarComponent from "../../../../scrollbar/vertical.scrollbar.component";
import Option from "../inlay/select.option.component";
import Select from "../select.report.component";

jest.mock("@chakra-ui/react", () => {
  const { forwardRef } = require("react");
  const {
    factoryInstance,
  } = require("../../../../../tests/fixtures/mock.chakra.react.factory.class");
  const chakraMock = factoryInstance.create(["Avatar", "Box", "Flex"]);
  chakraMock.Avatar = jest.fn().mockImplementation(() => <div>MockAvatar</div>);
  chakraMock.MockedBox = chakraMock.Box;
  chakraMock.Box = forwardRef(chakraMock.Box);
  return chakraMock;
});

jest.mock("flagsmith/react", () => ({
  useFlags: jest.fn(),
}));

jest.mock("../../../../billboard/billboard.component", () =>
  createMockedComponent("BillBoard")
);

jest.mock("../inlay/select.option.component", () =>
  createMockedComponent("Option")
);

jest.mock("../../../../scrollbar/vertical.scrollbar.component", () =>
  createMockedComponent("VerticalScrollBarComponent")
);

jest.mock("../../../../icons/lastfm/lastfm.icon", () => {
  return {
    __esModule: true,
    default: createMock("LastFMIcon"),
  };
});

const createMockedComponent = (name: string) => {
  const {
    factoryInstance,
  } = require("../../../../../tests/fixtures/mock.component.children.factory.class");
  return factoryInstance.create(name);
};

const createMock = (name: string) =>
  jest.fn(({ children }: { children: React.ReactChildren }) => {
    return <div data-testid={name}>{children}</div>;
  });

describe("SearchSelection", () => {
  const t = (key: string) => translationKeyLookup(key, translations);
  const mockRef = { current: null };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    render(<Select scrollRef={mockRef} />);
  };

  const checkChakraComponents = () => {
    it("should call Billboard with the correct props", () => {
      checkMockCall(Billboard, { title: translations.select.title }, 0, []);
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
      expect(MockedBox).toBeCalledTimes(3);
      checkMockCall(MockedBox, { position: "relative" }, 0);
      checkMockCall(MockedBox, { mb: 1 }, 1);
      checkMockCall(
        MockedBox,
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
      const call = (Avatar as jest.Mock).mock.calls[0][0];
      expect(call.width).toStrictEqual([50, 50, 75]);
      expect(renderToString(call.icon)).toBe(renderToString(<LastFMIcon />));
      expect(Object.keys(call).length).toBe(2);
    });

    it("should call VerticalScrollBarComponent as expected", () => {
      expect(VerticalScrollBarComponent).toBeCalledTimes(1);
      checkMockCall(
        VerticalScrollBarComponent,
        {
          horizontalOffset: 0,
          scrollRef: { current: null },
          update: null,
          verticalOffset: 0,
        },
        0
      );
    });
  };

  const checkFlagsForOptions = (expectedCount: number) => {
    it(`should render an Option for each flag-enabled report, (${expectedCount} times)`, () => {
      expect(Option).toBeCalledTimes(expectedCount);
      (Option as jest.Mock).mock.calls.forEach((mockCall, index) => {
        const call = mockCall[0];
        expect(typeof call.clickHandler).toBe("function");
        expect(call.analyticsName).toBe(
          config.select.options[index].analyticsName
        );
        expect(call.buttonText).toBe(
          t(config.select.options[index].buttonTextKey)
        );
        expect(call.indicatorText).toBe(
          t(config.select.options[index].indicatorTextKey)
        );
        expect(call.visibleIndicators).toBe(true);
      });
    });
  };

  describe(`when ${flags.report_playcount_by_artist} is missing`, () => {
    beforeEach(() => {
      (useFlags as jest.Mock).mockImplementation(() => ({}));
    });

    describe("when rendered", () => {
      beforeEach(() => {
        arrange();
      });

      checkChakraComponents();

      checkFlagsForOptions(3);
    });
  });

  describe(`when ${flags.report_playcount_by_artist} is disabled`, () => {
    beforeEach(() => {
      (useFlags as jest.Mock).mockImplementation(() => ({
        [flags.report_playcount_by_artist]: { enabled: false },
      }));
    });

    describe("when rendered", () => {
      beforeEach(() => {
        arrange();
      });

      checkChakraComponents();

      checkFlagsForOptions(3);
    });
  });

  describe(`when ${flags.report_playcount_by_artist} is enabled`, () => {
    beforeEach(() => {
      (useFlags as jest.Mock).mockImplementation(() => ({
        [flags.report_playcount_by_artist]: { enabled: true },
      }));
    });

    describe("when rendered", () => {
      beforeEach(() => {
        arrange();
      });

      checkChakraComponents();

      checkFlagsForOptions(4);
    });
  });
});
