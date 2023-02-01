import { ChakraProvider } from "@chakra-ui/react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import Top20ArtistsContainer, {
  Top20ArtistsReportContainerProps,
} from "../top20.artists.container";
import cardTranslations from "@locales/cards.json";
import translations from "@locales/lastfm.json";
import mockLastFMHook from "@src/hooks/__mocks__/lastfm.hook.mock";
import mockImageControllerHook from "@src/hooks/controllers/__mocks__/images.controller.hook.mock";
import { _t } from "@src/web/locale/translation/hooks/__mocks__/translation.hook.mock";
import { testIDs as drawerTestIDs } from "@src/web/reports/generics/components/drawer/drawer.identifiers";
import { testIDs as lastFMDrawerIDs } from "@src/web/reports/lastfm/generics/components/drawer/flip.card/flip.card.report.drawer.identifiers";
import type { userHookAsLastFMTop20ArtistReport } from "@src/types/user/hook.types";

jest.mock("@src/web/locale/translation/hooks/translation.hook");

jest.mock("@src/hooks/controllers/images.controller.hook");

jest.mock("@src/web/navigation/routing/hooks/router.hook");

describe("Top20ArtistsContainer", () => {
  let currentProps: Top20ArtistsReportContainerProps;
  let mockPropertyIndex = 1;

  const generateMockProperty = () => {
    const mockProperty = `mockProperty${mockPropertyIndex}`;
    mockPropertyIndex++;
    return mockProperty;
  };

  const mockUsername = "test-username";
  const mockReportProperties = {
    error: null,
    inProgress: false,
    profileUrl: null,
    ready: true,
    retries: 3,
    userName: mockUsername,
    data: {
      report: {
        artists: [],
        image: [],
        playcount: 0,
      },
      integration: "LASTFM" as const,
    },
  };

  const reportKey = "artists";
  const translationKey = "top20Artists";
  const testUrl = "https://thecorrect/url";
  const mockPlayCounts = ["101", "102"];
  const mockArtistData = [
    {
      mbid: generateMockProperty(),
      name: generateMockProperty(),
      playcount: mockPlayCounts[0],
      url: testUrl,
      image: [
        {
          size: "large" as const,
          "#text": generateMockProperty(),
        },
      ],
    },
    {
      mbid: generateMockProperty(),
      name: generateMockProperty(),
      playcount: mockPlayCounts[1],
      image: [
        {
          size: "large" as const,
          "#text": generateMockProperty(),
        },
      ],
    },
  ];

  const Top20ReportBaseProps = {
    lastfm: mockLastFMHook as userHookAsLastFMTop20ArtistReport,
    userName: mockUsername,
  };

  beforeEach(() => jest.clearAllMocks());

  const resetProps = () => {
    currentProps = { ...Top20ReportBaseProps };
    currentProps.lastfm.userProperties = mockReportProperties;
    currentProps.lastfm.userProperties.data.report.artists = {
      ...mockArtistData,
    };
  };

  const arrange = () => {
    return render(
      <ChakraProvider>
        <Top20ArtistsContainer {...currentProps} />
      </ChakraProvider>
    );
  };

  const getDataSet = () => getReport()[reportKey];

  const getDrawerTitle = (index: number) =>
    String(getDataSet()[index - 1].name);

  const getReport = () => currentProps.lastfm.userProperties.data.report;

  const getTranslation = () => translations[translationKey];

  const clickCard = async (index: number) => {
    const CardFrontImage = (await screen.findByAltText(
      `${_t(cardTranslations.frontAltText)}: ${index}`
    )) as HTMLImageElement;
    fireEvent.click(CardFrontImage);
    return CardFrontImage;
  };

  const checkReportTitle = () => {
    it("should render the report title text correctly", async () => {
      expect(await screen.findByText(_t(getTranslation().title))).toBeTruthy();

      expect(
        await screen.findByText(
          currentProps.lastfm.userProperties.userName as string
        )
      ).toBeTruthy();
    });
  };

  describe("when data is available", () => {
    beforeEach(() => {
      resetProps();
      currentProps.lastfm.userProperties.inProgress = false;
      getReport()[reportKey] = mockArtistData;
    });

    it("when an image is loaded", async () => {
      arrange();
      const CardFrontImage = (await screen.findByAltText(
        `${_t(cardTranslations.frontAltText)}: 1`
      )) as HTMLImageElement;
      fireEvent.load(CardFrontImage);
      expect(mockImageControllerHook.load).toBeCalledTimes(1);
    });

    describe("with the drawer closed", () => {
      beforeEach(() => {
        arrange();
      });

      checkReportTitle();

      it("should NOT render the drawer ", () => {
        expect(screen.queryByTestId(drawerTestIDs.Drawer)).toBeFalsy();
      });

      describe("when a card is clicked", () => {
        let CardFrontContainer: HTMLElement;

        beforeEach(async () => {
          const CardFrontImage = (await screen.findByAltText(
            `${_t(cardTranslations.frontAltText)}: 1`
          )) as HTMLImageElement;
          CardFrontContainer = CardFrontImage.parentElement?.parentElement
            ?.parentElement?.parentElement as HTMLElement;
        });

        it("should rotate the card", async () => {
          expect(CardFrontContainer).toHaveStyle({
            transform: "rotateY(0deg)",
          });

          await clickCard(1);

          expect(CardFrontContainer).toHaveStyle({
            transform: "rotateY(180deg)",
          });
        });

        it("should open the drawer", async () => {
          expect(
            screen.queryByAltText(_t(getTranslation().drawer.artWorkAltText))
          ).toBeNull();

          await clickCard(1);

          expect(
            screen.queryByAltText(_t(getTranslation().drawer.artWorkAltText))
          ).not.toBeNull();
        });
      });
    });

    describe("when the drawer is open", () => {
      const selected = 1;

      beforeEach(async () => {
        arrange();

        await clickCard(selected);
      });

      checkReportTitle();

      it("should render the drawer component", async () => {
        expect(
          await screen.findByTestId(drawerTestIDs.DrawerBody)
        ).toBeTruthy();
      });

      it("should render the drawer title correctly ", async () => {
        expect(await screen.findByText(getDrawerTitle(selected))).toBeTruthy();
      });

      it("should render the rank correctly", async () => {
        const rankElement = await screen.findByTestId(
          lastFMDrawerIDs.LastFMDrawerRank
        );
        expect(
          await within(rankElement).findByText(
            _t(translations.flipCardReport.drawer.rank)
          )
        ).toBeTruthy();
        expect(
          await within(rankElement).findByText(`: ${selected}`)
        ).toBeTruthy();
      });

      it("should render the playcount correctly", async () => {
        const playCountElement = await screen.findByTestId(
          lastFMDrawerIDs.LastFMDrawerPlayCount
        );
        expect(
          await within(playCountElement).findByText(
            _t(translations.flipCardReport.drawer.playCount)
          )
        ).toBeTruthy();
        expect(
          await within(playCountElement).findByText(
            `: ${mockPlayCounts[selected - 1]}`
          )
        ).toBeTruthy();
      });

      it("should open the correct link when the button is pressed", async () => {
        const buttonText = await screen.findByText(
          _t(translations.flipCardReport.drawer.buttonText)
        );
        const aTag = buttonText?.parentElement?.parentElement
          ?.parentElement as HTMLAnchorElement;
        expect(aTag.href).toBe(testUrl);
      });

      it("should close the drawer when the close drawer button is clicked", async () => {
        expect(
          screen.queryByAltText(_t(getTranslation().drawer.artWorkAltText))
        ).not.toBeNull();

        const closeButton = (await screen.findByTestId(
          drawerTestIDs.DrawerCloseButton
        )) as HTMLButtonElement;
        fireEvent.click(closeButton);

        expect(
          screen.queryByAltText(_t(getTranslation().drawer.artWorkAltText))
        ).toBeNull();
      });
    });
  });

  describe("when data is unavailable", () => {
    beforeEach(() => {
      resetProps();
      currentProps.lastfm.userProperties.inProgress = true;
      arrange();
    });

    it("should NOT render the title text", () => {
      expect(screen.queryByText(_t(getTranslation().title))).toBeNull();
    });
  });
});
