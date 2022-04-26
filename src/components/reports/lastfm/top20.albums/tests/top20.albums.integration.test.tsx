import { ChakraProvider } from "@chakra-ui/react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import cardTranslations from "../../../../../../public/locales/en/cards.json";
import translations from "../../../../../../public/locales/en/lastfm.json";
import UserAlbumDataState from "../../../../../providers/user/encapsulations/lastfm/flipcard/user.state.album.flipcard.report.class";
import translationLookUp from "../../../../../tests/fixtures/mock.translation";
import { testIDs as drawerTestIDs } from "../../../common/drawer/drawer.component";
import { testIDs as lastFMDrawerIDs } from "../../common/flip.card.report.drawer/flip.card.report.drawer.component";
import FlipCardReport, {
  FlipCardReportProps,
} from "../../common/flip.card.report/flip.card.report.component";
import Top20AlbumsReport from "../top20.albums.report.class";

const mockTranslation = jest.fn((translationKey: string) => {
  const lastfmTranslations = require("../../../../../../public/locales/en/lastfm.json");
  return translationLookUp(translationKey, lastfmTranslations);
});

const mockImageIsLoaded = jest.fn();
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
      albums: [],
      image: [],
      playcount: 0,
    },
    integration: "LASTFM" as const,
  },
};
let mockPropertyIndex = 1;

const Top20ReportBaseProps: FlipCardReportProps<UserAlbumDataState> = {
  report: new Top20AlbumsReport(),
  imageIsLoaded: mockImageIsLoaded,
  userState: new UserAlbumDataState(mockUserProperties, mockTranslation),
  visible: true,
  t: mockTranslation,
};

const generateMockProperty = () => {
  const colour = `mockProperty${mockPropertyIndex}`;
  mockPropertyIndex++;
  return colour;
};

describe("Top20AlbumsReport", () => {
  let currentProps: FlipCardReportProps<UserAlbumDataState>;
  const reportKey = "albums";
  const translationKey = "top20Albums";
  const testUrl = "https://thecorrect/url";
  const mockPlayCounts = ["101", "102"];
  const mockAlbumData = [
    {
      mbid: generateMockProperty(),
      name: generateMockProperty(),
      artist: {
        mbid: generateMockProperty(),
        name: generateMockProperty(),
      },
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
      artist: {
        mbid: generateMockProperty(),
        name: generateMockProperty(),
      },
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
  const getDrawerTitle = (index: number) =>
    `${getDataSet()[index - 1].artist?.name}: ${getDataSet()[index - 1].name}`;

  const arrange = () => {
    return render(
      <ChakraProvider>
        <FlipCardReport {...currentProps} />
      </ChakraProvider>
    );
  };

  const clickCard = async (index: number) => {
    const CardFrontImage = (await screen.findByAltText(
      `${cardTranslations.frontAltText}: ${index}`
    )) as HTMLImageElement;
    fireEvent.click(CardFrontImage);
    return CardFrontImage;
  };

  describe("when data is available", () => {
    beforeEach(() => {
      resetProps();
      currentProps.userState.userProperties.inProgress = false;
      getReport()[reportKey] = mockAlbumData;
    });

    it("when an image is loaded", async () => {
      arrange();
      const CardFrontImage = (await screen.findByAltText(
        `${cardTranslations.frontAltText}: 1`
      )) as HTMLImageElement;
      fireEvent.load(CardFrontImage);
      expect(mockImageIsLoaded).toBeCalledTimes(1);
    });

    describe("with the drawer closed", () => {
      beforeEach(() => {
        arrange();
      });

      it("should render the report title text correctly", async () => {
        expect(await screen.findByText(getTranslation().title)).toBeTruthy();
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
              `${cardTranslations.frontAltText}: ${i + 1}`
            )
          ).toBeTruthy();
          expect(
            await screen.findByAltText(
              `${cardTranslations.rearAltText}: ${i + 1}`
            )
          ).toBeTruthy();
        }
      });

      describe("when a card is clicked", () => {
        let CardFrontContainer: HTMLElement;

        beforeEach(async () => {
          const CardFrontImage = (await screen.findByAltText(
            `${cardTranslations.frontAltText}: 1`
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
            screen.queryByAltText(getTranslation().drawer.artWorkAltText)
          ).toBeNull();

          await clickCard(1);

          expect(
            screen.queryByAltText(getTranslation().drawer.artWorkAltText)
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
            translations.flipCardReport.drawer.rank
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
            translations.flipCardReport.drawer.playCount
          )
        ).toBeTruthy();
        expect(
          await within(playCountElement).findByText(`: ${mockPlayCounts[0]}`)
        ).toBeTruthy();
      });

      it("should open the correct link when the button is pressed", async () => {
        const button = await screen.findByText(
          translations.flipCardReport.drawer.buttonText
        );
        const aTag = button?.parentElement?.parentElement as HTMLAnchorElement;
        expect(aTag.href).toBe(testUrl);
      });

      it("should close the drawer when the close drawer button is clicked", async () => {
        expect(
          screen.queryByAltText(getTranslation().drawer.artWorkAltText)
        ).not.toBeNull();

        const closeButton = (await screen.findByTestId(
          drawerTestIDs.DrawerCloseButton
        )) as HTMLButtonElement;
        fireEvent.click(closeButton);

        expect(
          screen.queryByAltText(getTranslation().drawer.artWorkAltText)
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
      expect(screen.queryByText(getTranslation().title)).toBeNull();
    });
  });
});
