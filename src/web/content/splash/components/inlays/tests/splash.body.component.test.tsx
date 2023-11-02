import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import SplashBody from "../splash.body.component";
import dialogueSettings from "@src/config/dialogue";
import lastFMConfig from "@src/config/lastfm";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import { MockUseTranslation } from "@src/web/locale/translation/hooks/__mocks__/translation.hook.mock";
import ClickLink from "@src/web/navigation/links/components/click.link.external/click.link.external.component";
import mockUseRouter from "@src/web/navigation/routing/hooks/__mocks__/router.hook.mock";
import LastFMIconContainer from "@src/web/ui/generics/components/icons/lastfm/lastfm.icon.container";
import DimOnHover from "@src/web/ui/generics/components/styles/hover.dim/hover.dim.style";

jest.mock("@src/web/locale/translation/hooks/translation.hook");

jest.mock("@chakra-ui/react", () =>
  require("@fixtures/chakra").createChakraMock([
    "Avatar",
    "Box",
    "Flex",
    "Text",
  ])
);

jest.mock(
  "@src/web/ui/generics/components/buttons/button.standard/button.standard.component",
  () => require("@fixtures/react/parent").createComponent("Button")
);

jest.mock(
  "@src/web/navigation/links/components/click.link.external/click.link.external.component",
  () => require("@fixtures/react/parent").createComponent("ClickLink")
);

jest.mock(
  "@src/web/ui/generics/components/styles/hover.dim/hover.dim.style",
  () => require("@fixtures/react/parent").createComponent("DimOnHover")
);

jest.mock("@src/web/ui/generics/components/highlight/highlight.component", () =>
  require("@fixtures/react/parent").createComponent("Highlight")
);

describe("SplashBody", () => {
  const mockT = new MockUseTranslation("splash").t;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    return render(<SplashBody router={mockUseRouter} t={mockT} />);
  };

  describe("when rendered", () => {
    beforeEach(() => arrange());

    it("should call Avatar as expected to display the logo", () => {
      expect(Avatar).toHaveBeenCalledTimes(1);
      const call = jest.mocked(Avatar).mock.calls[0][0];
      expect(call.width).toStrictEqual(dialogueSettings.iconSizes);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(renderToString(call.icon!)).toBe(
        renderToString(
          <LastFMIconContainer {...dialogueSettings.iconComponentProps} />
        )
      );
      expect(Object.keys(call).length).toBe(2);
    });

    it("should call Box with the correct props", () => {
      expect(Box).toHaveBeenCalledTimes(2);
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
      expect(Text).toHaveBeenCalledTimes(2);
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
      expect(ClickLink).toHaveBeenCalledTimes(1);
      checkMockCall(ClickLink, { href: lastFMConfig.homePage });
    });

    it("should call DimOnHover with the correct props", () => {
      expect(DimOnHover).toHaveBeenCalledTimes(1);
      checkMockCall(DimOnHover, {});
    });

    it("should call Flex with the correct props", () => {
      expect(Flex).toHaveBeenCalledTimes(2);
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
