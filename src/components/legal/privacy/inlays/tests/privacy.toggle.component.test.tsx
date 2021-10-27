import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import translations from "../../../../../../public/locales/en/legal.json";
import externalLinks from "../../../../../config/external";
import checkMockCall from "../../../../../tests/fixtures/mock.component.call";
import tLookup from "../../../../../tests/fixtures/mock.translation";
import ClickLink from "../../../../clickable/click.link.external/click.link.external.component";
import SVSIcon from "../../../../icons/svs/svs.icon";
import DimOnHover from "../../../../styles/hover.dim/hover.dim.styles";
import PrivacyToggle from "../privacy.toggle.component";

jest.mock(
  "../../../../clickable/click.link.external/click.link.external.component",
  () => createMockedComponent("ClickLink")
);

jest.mock("../../../../styles/hover.dim/hover.dim.styles", () =>
  createMockedComponent("DimOnHover")
);

jest.mock("../../../../icons/svs/svs.icon", () =>
  jest.fn(() => <div>MockIcon</div>)
);

jest.mock("@chakra-ui/react", () => {
  const {
    factoryInstance,
  } = require("../../../../../tests/fixtures/mock.chakra.react.factory.class");
  return factoryInstance.create(["Avatar", "Box", "Flex", "Text"]);
});

const createMockedComponent = (name: string) => {
  const {
    factoryInstance,
  } = require("../../../../../tests/fixtures/mock.component.children.factory.class");
  return factoryInstance.create(name);
};

describe("PrivacyToggle", () => {
  const mockT = jest.fn((key) => tLookup(key, translations));

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    return render(<PrivacyToggle t={mockT} />);
  };

  describe("when rendered", () => {
    beforeEach(() => arrange());

    it("should call Avatar as expected to display the logo", () => {
      expect(Avatar).toBeCalledTimes(1);
      const call = (Avatar as jest.Mock).mock.calls[0][0];
      expect(call.width).toStrictEqual([50, 50, 75]);
      expect(renderToString(call.icon)).toBe(
        renderToString(<SVSIcon width={75} height={75} />)
      );
      expect(Object.keys(call).length).toBe(2);
    });

    it("should call ClickLink with the correct props", () => {
      expect(ClickLink).toBeCalledTimes(1);
      checkMockCall(ClickLink, { href: externalLinks.svs });
    });

    it("should call DimOnHover with the correct props", () => {
      expect(DimOnHover).toBeCalledTimes(1);
      checkMockCall(DimOnHover, {});
    });

    it("should call Flex with the correct props", () => {
      expect(Flex).toBeCalledTimes(1);
      checkMockCall(
        Flex,
        {
          align: "center",
          justify: "center",
        },
        0
      );
    });

    it("should call Box with the correct props", () => {
      expect(Box).toBeCalledTimes(1);
      checkMockCall(Box, {
        mb: [5, 5, 8],
      });
    });

    it("should call Text with the correct props", () => {
      expect(Text).toBeCalledTimes(1);
      checkMockCall(
        Text,
        {
          ml: 2,
          fontSize: ["l", "xl", "2xl"],
        },
        0
      );
    });
  });
});
