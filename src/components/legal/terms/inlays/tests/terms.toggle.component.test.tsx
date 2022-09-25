import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import TermsOfServiceToggle from "../terms.toggle.component";
import ClickLink from "@src/components/clickable/click.link.external/click.link.external.component";
import SVSIcon from "@src/components/icons/svs/svs.icon";
import DimOnHover from "@src/components/styles/hover.dim/hover.dim.styles";
import dialogueSettings from "@src/config/dialogue";
import externalLinks from "@src/config/external";
import { mockUseLocale } from "@src/hooks/tests/locale.mock.hook";
import checkMockCall from "@src/tests/fixtures/mock.component.call";

jest.mock(
  "@src/components/clickable/click.link.external/click.link.external.component",
  () => createMockedComponent("ClickLink")
);

jest.mock("@src/components/styles/hover.dim/hover.dim.styles", () =>
  createMockedComponent("DimOnHover")
);

jest.mock("@src/components/icons/svs/svs.icon", () =>
  jest.fn(() => <div>MockIcon</div>)
);

jest.mock("@chakra-ui/react", () => {
  const {
    factoryInstance,
  } = require("@src/tests/fixtures/mock.chakra.react.factory.class");
  return factoryInstance.create(["Avatar", "Box", "Flex", "Text"]);
});

const createMockedComponent = (name: string) => {
  const {
    factoryInstance,
  } = require("@src/tests/fixtures/mock.component.children.factory.class");
  return factoryInstance.create(name);
};

describe("TermsOfServiceToggle", () => {
  const mockT = new mockUseLocale("legal").t;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    return render(<TermsOfServiceToggle t={mockT} />);
  };

  describe("when rendered", () => {
    beforeEach(() => arrange());

    it("should call Avatar as expected to display the logo", () => {
      expect(Avatar).toBeCalledTimes(1);
      const call = (Avatar as jest.Mock).mock.calls[0][0];
      expect(call.width).toStrictEqual(dialogueSettings.iconSizes);
      expect(renderToString(call.icon)).toBe(
        renderToString(<SVSIcon {...dialogueSettings.iconComponentProps} />)
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
        mt: [3, 3, 5],
        mb: [5, 5, 8],
      });
    });

    it("should call Text with the correct props", () => {
      expect(Text).toBeCalledTimes(1);
      checkMockCall(
        Text,
        {
          ml: 2,
          fontSize: dialogueSettings.mediumTextFontSize,
        },
        0
      );
    });
  });
});
