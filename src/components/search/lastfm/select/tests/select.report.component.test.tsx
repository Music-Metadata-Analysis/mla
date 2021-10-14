import { Box, Flex, Avatar } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import translations from "../../../../../../public/locales/en/lastfm.json";
import checkMockCall from "../../../../../tests/fixtures/mock.component.call";
import Billboard from "../../../../billboard/billboard.component";
import Button from "../../../../button/button.standard/button.standard.component";
import LastFMIcon from "../../../../icons/lastfm/lastfm.icon";
import Select from "../select.report.component";

jest.mock("@chakra-ui/react", () => {
  const {
    factoryInstance,
  } = require("../../../../../tests/fixtures/mock.chakra.react.factory.class");
  const chakraMock = factoryInstance.create(["Box", "Flex"]);
  chakraMock.Avatar = jest.fn().mockImplementation(() => <div>MockAvatar</div>);
  return chakraMock;
});

jest.mock("../../../../billboard/billboard.component", () =>
  createMockedComponent("BillBoard")
);

jest.mock("../../../../button/button.standard/button.standard.component", () =>
  createMockedComponent("Button")
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
      expect(Flex).toBeCalledTimes(4);
      checkMockCall(Flex, { align: "center", justify: "space-between" }, 0);
      checkMockCall(
        Flex,
        {
          align: "center",
          direction: "column",
          justify: "center",
          mb: 5,
          w: "100%",
        },
        1
      );
      checkMockCall(
        Flex,
        {
          align: "center",
          justify: "center",
          mb: 2,
        },
        2
      );
      checkMockCall(
        Flex,
        {
          align: "center",
          justify: "center",
          mt: 2,
        },
        3
      );
    });

    it("should call Box as expected to create a margin around the form", () => {
      expect(Box).toBeCalledTimes(3);
      checkMockCall(Box, { mb: 5 }, 0);
      checkMockCall(Box, { mr: 5 }, 1);
      checkMockCall(Box, { mr: 5 }, 1);
    });

    it("should call Avatar as expected to display the logo", () => {
      expect(Avatar).toBeCalledTimes(1);
      const call = (Avatar as jest.Mock).mock.calls[0][0];
      expect(call.width).toStrictEqual([50, 50, 75]);
      expect(renderToString(call.icon)).toBe(renderToString(<LastFMIcon />));
      expect(Object.keys(call).length).toBe(2);
    });

    it("should call Button as expected", () => {
      expect(Button).toBeCalledTimes(2);
      checkMockCall(Button, { analyticsName: "Top Albums", w: 200 }, 0);
      checkMockCall(Button, { analyticsName: "Top Artists", w: 200 }, 1);
    });
  });
});
