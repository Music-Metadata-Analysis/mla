import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import SplashBody from "../splash.body.component";
import ClickLink from "@src/components/clickable/click.link.external/click.link.external.component";
import LastFMIcon from "@src/components/icons/lastfm/lastfm.icon";
import DimOnHover from "@src/components/styles/hover.dim/hover.dim.styles";
import dialogueSettings from "@src/config/dialogue";
import lastFMConfig from "@src/config/lastfm";
import { mockUseLocale } from "@src/hooks/tests/locale.mock.hook";
import checkMockCall from "@src/tests/fixtures/mock.component.call";

jest.mock(
  "@src/hooks/locale",
  () => (filename: string) => new mockUseLocale(filename)
);

jest.mock(
  "@src/components/button/button.standard/button.standard.component",
  () => require("@fixtures/react").createComponent("Button")
);

jest.mock(
  "@src/components/clickable/click.link.external/click.link.external.component",
  () => require("@fixtures/react").createComponent("ClickLink")
);

jest.mock("@src/components/styles/hover.dim/hover.dim.styles", () =>
  require("@fixtures/react").createComponent("DimOnHover")
);

jest.mock("@src/components/highlight/highlight.component", () =>
  require("@fixtures/react").createComponent("Highlight")
);

jest.mock("@chakra-ui/react", () => {
  const { createChakraMock } = require("@fixtures/chakra");
  return createChakraMock(["Avatar", "Box", "Flex", "Text"]);
});

describe("SplashBody", () => {
  const mockT = new mockUseLocale("splash").t;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    return render(<SplashBody t={mockT} />);
  };

  describe("when rendered", () => {
    beforeEach(() => arrange());

    it("should call Avatar as expected to display the logo", () => {
      expect(Avatar).toBeCalledTimes(1);
      const call = (Avatar as jest.Mock).mock.calls[0][0];
      expect(call.width).toStrictEqual(dialogueSettings.iconSizes);
      expect(renderToString(call.icon)).toBe(
        renderToString(<LastFMIcon {...dialogueSettings.iconComponentProps} />)
      );
      expect(Object.keys(call).length).toBe(2);
    });

    it("should call Box with the correct props", () => {
      expect(Box).toBeCalledTimes(2);
      checkMockCall(
        Box,
        {
          mb: [3, 3, 7],
        },
        0
      );
      checkMockCall(
        Box,
        {
          mb: [5, 5, 8],
        },
        1
      );
    });

    it("should call Text with the correct props", () => {
      expect(Text).toBeCalledTimes(2);
      checkMockCall(
        Text,
        {
          ml: 2,
          fontSize: ["xxs"],
        },
        0
      );
      checkMockCall(
        Text,
        {
          ml: 2,
          fontSize: dialogueSettings.mediumTextFontSize,
        },
        1
      );
    });

    it("should call ClickLink with the correct props", () => {
      expect(ClickLink).toBeCalledTimes(1);
      checkMockCall(ClickLink, { href: lastFMConfig.homePage });
    });

    it("should call DimOnHover with the correct props", () => {
      expect(DimOnHover).toBeCalledTimes(1);
      checkMockCall(DimOnHover, {});
    });

    it("should call Flex with the correct props", () => {
      expect(Flex).toBeCalledTimes(2);
      checkMockCall(
        Flex,
        {
          align: "center",
          justify: "center",
          direction: "column",
        },
        0
      );
      checkMockCall(
        Flex,
        {
          align: "center",
        },
        1
      );
    });
  });
});
