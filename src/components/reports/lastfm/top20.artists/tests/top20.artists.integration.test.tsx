import { ChakraProvider } from "@chakra-ui/react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import Top20ArtistsReport from "../top20.artists.report.class";
import cardTranslations from "@locales/cards.json";
import translations from "@locales/lastfm.json";
import { testIDs as drawerTestIDs } from "@src/components/reports/common/drawer/drawer.component";
import { testIDs as lastFMDrawerIDs } from "@src/components/reports/lastfm/common/flip.card.report.drawer/flip.card.report.drawer.component";
import FlipCardReport, {
  FlipCardReportProps,
} from "@src/components/reports/lastfm/common/flip.card.report/flip.card.report.component";
import { MockUseLocale, _t } from "@src/hooks/__mocks__/locale.mock";
import UserArtistDataState from "@src/providers/user/encapsulations/lastfm/flipcard/user.state.artist.flipcard.report.class";

jest.mock("@src/hooks/locale");

const mockImageIsLoaded = jest.fn();
const mockT = new MockUseLocale("lastfm").t;
const mockUsername = "test-username";
const mockUserProperties = {
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
let mockPropertyIndex = 1;

const Top20ReportBaseProps: FlipCardReportProps<UserArtistDataState> = {
  report: new Top20ArtistsReport(),
  imageIsLoaded: mockImageIsLoaded,
  userState: new UserArtistDataState(mockUserProperties, mockT),
  visible: true,
  t: mockT,
};

const generateMockProperty = () => {
  const colour = `mockProperty${mockPropertyIndex}`;
  mockPropertyIndex++;
  return colour;
};

describe("Top20ArtistsReport", () => {
  let currentProps: FlipCardReportProps<UserArtistDataState>;
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

  beforeEach(() => jest.clearAllMocks());

  const resetProps = () => {
    currentProps = { ...Top20ReportBaseProps };
  };

  const getDataSet = () => getReport()[reportKey];
  const getReport = () => currentProps.userState.userProperties.data.report;
  const getTranslation = () => translations[translationKey];
  const getDrawerTitle = (index: number) => `${getDataSet()[index - 1].name}`;

  const arrange = () => {
    return render(
      <ChakraProvider>
        <FlipCardReport {...currentProps} />
      </ChakraProvider>
    );
  };

  const clickCard = async (index: number) => {
    const CardFrontImage = (await screen.findByAltText(
      `${_t(cardTranslations.frontAltText)}: ${index}`
    )) as HTMLImageElement;
    fireEvent.click(CardFrontImage);
    return CardFrontImage;
  };

  describe("when data is available", () => {
    beforeEach(() => {
      resetProps();
      currentProps.userState.userProperties.inProgress = false;
      getReport()[reportKey] = mockArtistData;
    });

    it("when an image is loaded", async () => {
      arrange();
      const CardFrontImage = (await screen.findByAltText(
        `${_t(cardTranslations.frontAltText)}: 1`
      )) as HTMLImageElement;
      fireEvent.load(CardFrontImage);
      expect(mockImageIsLoaded).toBeCalledTimes(1);
    });

    describe("with the drawer closed", () => {
      beforeEach(() => {
        arrange();
      });

      it("should render the report title text correctly", async () => {
        expect(
          await screen.findByText(_t(getTranslation().title))
        ).toBeTruthy();
        expect(
          await screen.findByText(
            currentProps.userState.userProperties.userName as string
          )
        ).toBeTruthy();
      });

      it("should render the flip cards correctly", async () => {
        for (let i = 0; i < getDataSet().length; i++) {
          expect(
            await screen.findByAltText(
              `${_t(cardTranslations.frontAltText)}: ${i + 1}`
            )
          ).toBeTruthy();
          expect(
            await screen.findByAltText(
              `${_t(cardTranslations.rearAltText)}: ${i + 1}`
            )
          ).toBeTruthy();
        }
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
      beforeEach(async () => {
        arrange();
        await clickCard(1);
      });

      it("should render a title", async () => {
        expect(await screen.findByText(getDrawerTitle(1))).toBeTruthy();
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
        expect(await within(rankElement).findByText(": 1")).toBeTruthy();
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
          await within(playCountElement).findByText(`: ${mockPlayCounts[0]}`)
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
      currentProps.userState.userProperties.inProgress = true;
      arrange();
    });

    it("should NOT render the title text", () => {
      expect(screen.queryByText(_t(getTranslation().title))).toBeNull();
    });
  });
});
