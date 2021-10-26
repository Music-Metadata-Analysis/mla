import { Box, Flex, Avatar } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import translations from "../../../../../../public/locales/en/lastfm.json";
import config from "../../../../../config/lastfm";
import checkMockCall from "../../../../../tests/fixtures/mock.component.call";
import translationKeyLookup from "../../../../../tests/fixtures/mock.translation";
import Billboard from "../../../../billboard/billboard.component";
import LastFMIcon from "../../../../icons/lastfm/lastfm.icon";
import Option from "../inlay/select.option.component";
import Select from "../select.report.component";

jest.mock("@chakra-ui/react", () => {
  const {
    factoryInstance,
  } = require("../../../../../tests/fixtures/mock.chakra.react.factory.class");
  const chakraMock = factoryInstance.create(["Avatar", "Box", "Flex"]);
  chakraMock.Avatar = jest.fn().mockImplementation(() => <div>MockAvatar</div>);
  return chakraMock;
});

jest.mock("../../../../billboard/billboard.component", () =>
  createMockedComponent("BillBoard")
);

jest.mock("../inlay/select.option.component", () =>
  createMockedComponent("Option")
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    render(<Select />);
  };

  describe("when rendered", () => {
    beforeEach(() => {
      arrange();
    });

    it("should call Billboard with the correct props", () => {
      checkMockCall(Billboard, { title: translations.select.title }, 0, []);
    });

    it("should call Flex as expected to center content", () => {
      expect(Flex).toBeCalledTimes(2);
      checkMockCall(Flex, { align: "center", justify: "center" }, 0);
      checkMockCall(
        Flex,
        {
          align: "center",
          direction: "column",
          justify: "center",
          mb: 5,
        },
        1
      );
    });

    it("should call Box as expected to create a margin around the form", () => {
      expect(Box).toBeCalledTimes(1);
      checkMockCall(Box, { mb: 5, mr: 10 }, 0);
    });

    it("should call Avatar as expected to display the logo", () => {
      expect(Avatar).toBeCalledTimes(1);
      const call = (Avatar as jest.Mock).mock.calls[0][0];
      expect(call.width).toStrictEqual([50, 50, 75]);
      expect(renderToString(call.icon)).toBe(renderToString(<LastFMIcon />));
      expect(Object.keys(call).length).toBe(2);
    });

    it("should call Button as expected", () => {
      expect(Option).toBeCalledTimes(3);
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
  });
});
