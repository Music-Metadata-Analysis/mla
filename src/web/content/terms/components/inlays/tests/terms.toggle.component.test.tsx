import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import TermsOfServiceToggle from "../terms.toggle.component";
import dialogueSettings from "@src/config/dialogue";
import externalLinks from "@src/config/external";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import { MockUseTranslation } from "@src/web/locale/translation/hooks/__mocks__/translation.hook.mock";
import ClickLink from "@src/web/navigation/links/components/click.link.external/click.link.external.component";
import mockUseRouter from "@src/web/navigation/routing/hooks/__mocks__/router.hook.mock";
import SVSIconContainer from "@src/web/ui/generics/components/icons/svs/svs.icon.container";
import DimOnHover from "@src/web/ui/generics/components/styles/hover.dim/hover.dim.style";

jest.mock("@chakra-ui/react", () =>
  require("@fixtures/chakra").createChakraMock([
    "Avatar",
    "Box",
    "Flex",
    "Text",
  ])
);

jest.mock(
  "@src/web/navigation/links/components/click.link.external/click.link.external.component",
  () => require("@fixtures/react/parent").createComponent("ClickLink")
);

jest.mock(
  "@src/web/ui/generics/components/styles/hover.dim/hover.dim.style",
  () => require("@fixtures/react/parent").createComponent("DimOnHover")
);

jest.mock("@src/web/ui/generics/components/icons/svs/svs.icon.container", () =>
  require("@fixtures/react/child").createComponent("SVSIconContainer")
);

describe("TermsOfServiceToggle", () => {
  const mockT = new MockUseTranslation("legal").t;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    return render(<TermsOfServiceToggle router={mockUseRouter} t={mockT} />);
  };

  describe("when rendered", () => {
    beforeEach(() => arrange());

    it("should call Avatar as expected to display the logo", () => {
      expect(Avatar).toHaveBeenCalledTimes(1);
      const call = jest.mocked(Avatar).mock.calls[0][0];
      expect(call.height).toStrictEqual(dialogueSettings.iconSizes);
      expect(call.width).toStrictEqual(dialogueSettings.iconSizes);
      expect(renderToString(call.icon!)).toBe(
        renderToString(<SVSIconContainer />)
      );
      expect(Object.keys(call).length).toBe(3);
    });

    it("should call ClickLink with the correct props", () => {
      expect(ClickLink).toHaveBeenCalledTimes(1);
      checkMockCall(ClickLink, { href: externalLinks.svs });
    });

    it("should call DimOnHover with the correct props", () => {
      expect(DimOnHover).toHaveBeenCalledTimes(1);
      checkMockCall(DimOnHover, {});
    });

    it("should call Flex with the correct props", () => {
      expect(Flex).toHaveBeenCalledTimes(1);
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
      expect(Box).toHaveBeenCalledTimes(1);
      checkMockCall(Box, {
        mt: [3, 3, 5],
        mb: [5, 5, 8],
      });
    });

    it("should call Text with the correct props", () => {
      expect(Text).toHaveBeenCalledTimes(1);
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
