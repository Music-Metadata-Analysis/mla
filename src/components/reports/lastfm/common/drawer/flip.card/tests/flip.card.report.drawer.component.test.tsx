import { Box, Divider, Flex, Img, Text } from "@chakra-ui/react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import FlipCardDrawer, {
  FlipCardDrawerProps,
} from "../flip.card.report.drawer.component";
import { testIDs } from "../flip.card.report.drawer.identifiers";
import lastfmTranslations from "@locales/lastfm.json";
import StyledButtonLink from "@src/components/button/button.external.link/button.external.link.component";
import ReportDrawer from "@src/components/reports/common/drawer/drawer.component";
import mockFlipCardController from "@src/components/reports/lastfm/common/report.component/flip.card/controllers/__mocks__/flip.card.controller.hook.mock";
import settings from "@src/config/flip.card";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import mockColourHook from "@src/hooks/ui/__mocks__/colour.hook.mock";
import {
  MockUseTranslation,
  _t,
} from "@src/web/locale/translation/hooks/__mocks__/translation.hook.mock";

jest.mock("@src/hooks/ui/colour.hook");

jest.mock("@chakra-ui/react", () =>
  require("@fixtures/chakra").createChakraMock([
    "Box",
    "Divider",
    "Flex",
    "Img",
    "Text",
  ])
);

jest.mock(
  "@src/components/button/button.external.link/button.external.link.component",
  () => require("@fixtures/react/parent").createComponent("StyledButtonLink")
);

jest.mock("@src/components/reports/common/drawer/drawer.component", () =>
  require("@fixtures/react/parent").createComponent("Drawer")
);

describe("FlipCardDrawer", () => {
  let currentProps: FlipCardDrawerProps;

  const mockT = new MockUseTranslation("lastfm").t;

  const baseProps: FlipCardDrawerProps = {
    artWorkAltTranslatedText: "artWorkAltTranslatedText",
    artWorkSourceUrl: "artWorkSourceUrl",
    drawerTitle: "drawerTitle",
    externalLink: "externalLink",
    fallbackImage: "/fallback.jpeg",
    isOpen: mockFlipCardController.drawer.state,
    objectIndex: 0,
    onClose: mockFlipCardController.drawer.setFalse,
    value: "mockValue",
    t: mockT,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    resetProps();
  });

  const resetProps = () => {
    currentProps = { ...baseProps };
  };

  const arrange = () => {
    render(<FlipCardDrawer {...currentProps} />);
  };

  const checkDrawerComponent = () => {
    it("should render the common ReportDrawer component with correct props", () => {
      expect(ReportDrawer).toBeCalledTimes(1);
      checkMockCall(
        ReportDrawer,
        {
          "data-testid": testIDs.LastFMDrawer,
          isOpen: currentProps.isOpen,
          title: currentProps.drawerTitle,
          placement: "bottom",
        },
        0,
        ["onClose"]
      );
    });
  };

  const checkFlexComponent = () => {
    it("should render the chakra Flex component with expected props", () => {
      expect(Flex).toBeCalledTimes(2);
      checkMockCall(Flex, {}, 0);
      checkMockCall(
        Flex,
        { flexDirection: "column", justifyContent: "space-between" },
        1
      );
    });
  };

  const checkBoxComponent = () => {
    it("should render the chakra Box component with expected props", () => {
      expect(Box).toBeCalledTimes(1);
      checkMockCall(Box, {}, 0);
    });
  };

  const checkDividerComponent = () => {
    it("should render the chakra Divider component with expected props", () => {
      expect(Divider).toBeCalledTimes(1);
      checkMockCall(
        Divider,
        {
          ml: "10px",
          mr: "10px",
          orientation: "vertical",
        },
        0
      );
    });
  };

  const checkImageComponent = () => {
    it("should render the chakra Img component with expected props", () => {
      expect(Img).toBeCalledTimes(1);
      checkMockCall(
        Img,
        {
          alt: currentProps.artWorkAltTranslatedText,
          borderColor: mockColourHook.componentColour.details,
          borderStyle: "solid",
          borderWidth: "1px",
          src: currentProps.artWorkSourceUrl,
          style: {
            position: "relative",
          },
          width: `${settings.drawer.imageSize}px`,
        },
        0,
        ["onError"]
      );
    });
  };

  const checkTextComponent = () => {
    it("should render the chakra Text component with expected props", () => {
      expect(Text).toBeCalledTimes(3);
      checkMockCall(
        Text,
        {
          "data-testid": testIDs.LastFMDrawerRank,
          fontSize: ["sm", "md"],
        },
        0
      );
      checkMockCall(
        Text,
        {
          "data-testid": testIDs.LastFMDrawerPlayCount,
          fontSize: ["sm", "md"],
        },
        1
      );
      checkMockCall(
        Text,
        {
          fontSize: ["sm", "md"],
        },
        2
      );
    });

    it("should render the rank Text child correctly", async () => {
      const rankElement = await screen.findByTestId(testIDs.LastFMDrawerRank);
      expect(
        await within(rankElement).findByText(
          _t(lastfmTranslations.flipCardReport.drawer.rank)
        )
      ).toBeTruthy();
      expect(
        await within(rankElement).findByText(
          `: ${currentProps.objectIndex + 1}`
        )
      ).toBeTruthy();
    });

    it("should render the playcount Text child correctly", async () => {
      const playCountElement = await screen.findByTestId(
        testIDs.LastFMDrawerPlayCount
      );
      expect(
        await within(playCountElement).findByText(
          _t(lastfmTranslations.flipCardReport.drawer.playCount)
        )
      ).toBeTruthy();
      expect(
        await within(playCountElement).findByText(`: ${currentProps.value}`)
      ).toBeTruthy();
    });
  };

  const checkButtonLink = () => {
    it("should render the chakra StyledButtonLink component with expected props", () => {
      expect(StyledButtonLink).toBeCalledTimes(1);
      const call = jest.mocked(StyledButtonLink).mock.calls[0][0];
      expect(call.href).toBe(currentProps.externalLink);
    });

    it("should render the StyledButtonLink text correctly", async () => {
      expect(
        await screen.findByText(
          _t(lastfmTranslations.flipCardReport.drawer.buttonText)
        )
      ).toBeTruthy();
    });
  };

  const checkImageLoadError = () => {
    describe("when there is an error loading the image", () => {
      let image: HTMLElement;

      beforeEach(async () => {
        image = await screen.findByAltText(
          currentProps.artWorkAltTranslatedText
        );
        expect(image).toHaveAttribute("src", currentProps.artWorkSourceUrl);
        fireEvent.error(image);
      });

      it("should set the image url to the fallback", () => {
        expect(image).toHaveAttribute("src", currentProps.fallbackImage);
      });
    });
  };

  describe("when the drawer is open", () => {
    beforeEach(() => {
      currentProps.isOpen = true;

      arrange();
    });

    checkDrawerComponent();
    checkFlexComponent();
    checkBoxComponent();
    checkDividerComponent();
    checkImageComponent();
    checkImageLoadError();
    checkTextComponent();
    checkButtonLink();
  });

  describe("when the drawer is closed", () => {
    beforeEach(() => {
      currentProps.isOpen = false;

      arrange();
    });

    checkDrawerComponent();
    checkFlexComponent();
    checkBoxComponent();
    checkDividerComponent();
    checkImageComponent();
    checkImageLoadError();
    checkTextComponent();
    checkButtonLink();
  });
});
