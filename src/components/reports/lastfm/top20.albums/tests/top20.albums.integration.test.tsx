import { ChakraProvider } from "@chakra-ui/react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import cardTranslations from "../../../../../../public/locales/en/cards.json";
import translations from "../../../../../../public/locales/en/lastfm.json";
import UserAlbumDataState from "../../../../../providers/user/encapsulations/user.state.album.class";
import translationLookUp from "../../../../../tests/fixtures/mock.translation";
import { testIDs as drawerTestIDs } from "../../../common/drawer/drawer.component";
import LastFMFlipCardReport, {
  LastFMFlipCardReportProps,
} from "../../common/flip.card.report/flip.card.report.component";
import AlbumDrawer from "../drawer.album/drawer.album.component";
import { testIDs as albumDrawerTestIDs } from "../drawer.album/drawer.album.component";

const mockImageIsLoaded = jest.fn();
const mockUsername = "test-username";
const mockUserProperties = {
  error: null,
  inProgress: false,
  profileUrl: null,
  ready: true,
  userName: mockUsername,
  data: {
    report: {
      albums: [],
      image: [],
    },
    integration: "LASTFM" as const,
  },
};

const mockTranslation = jest.fn((translationKey: string) => {
  const lastfmTranslations = require("../../../../../../public/locales/en/lastfm.json");
  return translationLookUp(translationKey, lastfmTranslations);
});

const Top20ReportBaseProps: LastFMFlipCardReportProps<UserAlbumDataState> = {
  DrawerComponent: AlbumDrawer,
  imageIsLoaded: mockImageIsLoaded,
  flipCardData: [],
  reportTranslationKey: "top20Albums",
  userState: new UserAlbumDataState(mockUserProperties, mockTranslation),
  visible: true,
  t: mockTranslation,
};

describe("Top20AlbumsReport", () => {
  let currentProps: LastFMFlipCardReportProps<UserAlbumDataState>;
  const albumUrl = "https://thecorrect/url";
  const mockAlbumData = [
    {
      mbid: "some_mbid1",
      name: "mock_album1",
      artist: {
        mbid: "some_mbid1",
        name: "mock_artist1",
      },
      playcount: "101",
      url: albumUrl,
      image: [
        {
          size: "large" as const,
          "#text": "http://someurl1.com",
        },
      ],
    },
    {
      mbid: "some_mbid2",
      name: "mock_album2",
      artist: {
        mbid: "some_mbid2",
        name: "mock_artist2",
      },
      playcount: "102",
      image: [
        {
          size: "large" as const,
          "#text": "http://someurl2.com",
        },
      ],
    },
  ];

  beforeEach(() => jest.clearAllMocks());

  const resetProps = () => {
    currentProps = { ...Top20ReportBaseProps };
  };

  const arrange = () => {
    currentProps.flipCardData = currentProps.userState.userProperties.data
      .report.albums as unknown[];
    return render(
      <ChakraProvider>
        <LastFMFlipCardReport {...currentProps} />
      </ChakraProvider>
    );
  };

  const clickCard = async () => {
    const CardFrontImage = (await screen.findByAltText(
      `${cardTranslations.frontAltText}: 1`
    )) as HTMLImageElement;
    fireEvent.click(CardFrontImage);
    return CardFrontImage;
  };

  describe("when data is available", () => {
    beforeEach(() => {
      resetProps();
      currentProps.userState.userProperties.inProgress = false;
      currentProps.userState.userProperties.data.report.albums = mockAlbumData;
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
        expect(
          await screen.findByText(translations.top20Albums.title)
        ).toBeTruthy();
        expect(
          await screen.findByText(
            currentProps.userState.userProperties.userName as string
          )
        ).toBeTruthy();
      });

      it("should render the flip cards correctly", async () => {
        expect(
          await screen.findByAltText(`${cardTranslations.rearAltText}: 1`)
        ).toBeTruthy();
        expect(
          await screen.findByAltText(`${cardTranslations.frontAltText}: 1`)
        ).toBeTruthy();
        expect(
          await screen.findByAltText(`${cardTranslations.rearAltText}: 2`)
        ).toBeTruthy();
        expect(
          await screen.findByAltText(`${cardTranslations.frontAltText}: 2`)
        ).toBeTruthy();
      });

      describe("when a card is clicked", () => {
        it("should rotate the card", async () => {
          const CardFrontImage = (await screen.findByAltText(
            `${cardTranslations.frontAltText}: 1`
          )) as HTMLImageElement;
          const CardFrontContainer =
            CardFrontImage.parentElement?.parentElement?.parentElement
              ?.parentElement;

          expect(CardFrontContainer).toHaveStyle({
            transform: "rotateY(0deg)",
          });

          await clickCard();

          expect(CardFrontContainer).toHaveStyle({
            transform: "rotateY(180deg)",
          });
        });

        it("should open the drawer", async () => {
          expect(
            screen.queryByAltText(
              translations.top20Albums.drawer.coverArtAltText
            )
          ).toBeNull();

          await clickCard();

          expect(
            screen.queryByAltText(
              translations.top20Albums.drawer.coverArtAltText
            )
          ).not.toBeNull();
        });
      });
    });

    describe("when the drawer is open", () => {
      beforeEach(async () => {
        arrange();
        await clickCard();
      });

      it("should render a title with defaults", async () => {
        expect(
          await screen.findByText("mock_artist1: mock_album1")
        ).toBeTruthy();
      });

      it("should render the rank correctly", async () => {
        const rankElement = await screen.findByTestId(
          albumDrawerTestIDs.AlbumDrawerRank
        );
        expect(
          await within(rankElement).findByText(
            translations.top20Albums.drawer.rank
          )
        ).toBeTruthy();
        expect(await within(rankElement).findByText(": 1")).toBeTruthy();
      });

      it("should render the playcount correctly", async () => {
        const playCountElement = await screen.findByTestId(
          albumDrawerTestIDs.AlbumDrawerPlayCount
        );
        expect(
          await within(playCountElement).findByText(
            translations.top20Albums.drawer.playCount
          )
        ).toBeTruthy();
        expect(await within(playCountElement).findByText(": 101")).toBeTruthy();
      });

      it("should open the correct link when the button is pressed", async () => {
        const button = await screen.findByText(
          translations.top20Albums.drawer.albumButtonText
        );
        const aTag = button?.parentElement?.parentElement as HTMLAnchorElement;
        expect(aTag.href).toBe(albumUrl);
      });

      it("should close the drawer when the close drawer button is clicked", async () => {
        expect(
          screen.queryByAltText(translations.top20Albums.drawer.coverArtAltText)
        ).not.toBeNull();

        const closeButton = (await screen.findByTestId(
          drawerTestIDs.DrawerCloseButton
        )) as HTMLButtonElement;
        fireEvent.click(closeButton);

        expect(
          screen.queryByAltText(translations.top20Albums.drawer.coverArtAltText)
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
      expect(screen.queryByText(translations.top20Albums.title)).toBeNull();
    });
  });
});
