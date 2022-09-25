import { Box, Divider, Img, Text } from "@chakra-ui/react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import FlipCardDrawer, {
  LastFMDrawerInterface,
  testIDs,
} from "../flip.card.report.drawer.component";
import lastfmTranslations from "@locales/lastfm.json";
import StyledButtonLink from "@src/components/button/button.external.link/button.external.link.component";
import Drawer from "@src/components/reports/common/drawer/drawer.component";
import Events from "@src/events/events";
import mockAnalyticsHook from "@src/hooks/tests/analytics.mock.hook";
import mockColourHook from "@src/hooks/tests/colour.hook.mock";
import { mockUseLocale, _t } from "@src/hooks/tests/locale.mock.hook";
import UserAlbumState from "@src/providers/user/encapsulations/lastfm/flipcard/user.state.album.flipcard.report.class";
import checkMockCall from "@src/tests/fixtures/mock.component.call";

jest.mock("@src/hooks/analytics", () => () => mockAnalyticsHook);

jest.mock("@src/hooks/colour", () => () => mockColourHook);

jest.mock(
  "@src/components/button/button.external.link/button.external.link.component",
  () => {
    const {
      factoryInstance,
    } = require("@src/tests/fixtures/mock.component.children.factory.class");
    return factoryInstance.create("StyledButtonLink");
  }
);

jest.mock("@src/components/reports/common/drawer/drawer.component", () => {
  const {
    factoryInstance,
  } = require("@src/tests/fixtures/mock.component.children.factory.class");
  return factoryInstance.create("MockDrawer");
});

jest.mock("@chakra-ui/react", () => {
  const {
    factoryInstance,
  } = require("@src/tests/fixtures/mock.chakra.react.factory.class");
  return factoryInstance.create(["Box", "Divider", "Img", "Text"]);
});

const mockOnClose = jest.fn();
const mockT = new mockUseLocale("lastfm").t;
const mockBaseUserProperties = {
  data: {
    integration: "LASTFM" as const,
    report: {
      albums: [],
      image: [],
      playcount: 0,
    },
  },
  error: null,
  inProgress: false,
  profileUrl: null,
  ready: true,
  retries: 3,
  userName: null,
};

const mockState = new UserAlbumState(mockBaseUserProperties, mockT);

const baseProps: LastFMDrawerInterface<UserAlbumState> = {
  objectIndex: 0,
  artWorkAltText: lastfmTranslations.top20Albums.noArtWork,
  userState: mockState,
  fallbackImage: "/fallback.jpeg",
  isOpen: true,
  onClose: mockOnClose,
  t: mockT,
};

describe("FlipCardReportDrawer", () => {
  let currentProps: LastFMDrawerInterface<UserAlbumState>;
  const MockImageUrl = "MockImageUrl";

  beforeEach(() => jest.clearAllMocks());

  const resetProps = () => {
    baseProps.userState = new UserAlbumState(mockBaseUserProperties, mockT);
    currentProps = { ...baseProps };
  };

  const arrange = () => {
    render(<FlipCardDrawer {...currentProps} />);
  };

  const checkBaseComponents = (externalLink: string, title: string) => {
    it("should call Drawer once", () => {
      expect(Drawer).toBeCalledTimes(1);
      checkMockCall(
        Drawer,
        {
          "data-testid": testIDs.LastFMDrawer,
          isOpen: true,
          title,
          placement: "bottom",
        },
        0,
        ["onClose"]
      );
    });

    it("should call Drawer once", () => {
      expect(Drawer).toBeCalledTimes(1);
    });

    it("should call Divider 1 times", () => {
      expect(Divider).toBeCalledTimes(1);
    });

    it("should call Box once", () => {
      expect(Box).toBeCalledTimes(1);
      checkMockCall(Box, {}, 0);
    });

    it("should call Text 2 times", () => {
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

    it("should call Img once", () => {
      expect(Img).toBeCalledTimes(1);
      checkMockCall(
        Img,
        {
          alt: mockT(lastfmTranslations.top20Albums.noArtWork),
          borderColor: mockColourHook.componentColour.details,
          borderStyle: "solid",
          borderWidth: "1px",
          src: MockImageUrl,
          style: {
            position: "relative",
          },
          width: "150px",
        },
        0,
        ["onError"]
      );
    });

    it("should call StyledButtonLink once", () => {
      expect(StyledButtonLink).toBeCalledTimes(1);
      const call = (StyledButtonLink as jest.Mock).mock.calls[0][0];
      expect(call.href).toBe(externalLink);
    });
  };

  describe("when isOpen is true", () => {
    beforeEach(() => {
      resetProps();
      currentProps.isOpen = true;
    });

    describe("when the album info is NOT complete", () => {
      beforeEach(() => {
        currentProps.userState.userProperties.data.report.albums = [
          {
            mbid: "some_mbid",
            image: [
              {
                "#text": MockImageUrl,
                size: "large",
              },
            ],
          },
        ];
        currentProps.objectIndex = 0;
        arrange();
      });

      checkBaseComponents(
        `https://last.fm/music/t(Unknown%20Artist)/t(Unknown%20Album)`,
        `${_t(lastfmTranslations.defaults.artistName)}: ${_t(
          lastfmTranslations.defaults.albumName
        )}`
      );

      it("should render the rank correctly", async () => {
        const rankElement = await screen.findByTestId(testIDs.LastFMDrawerRank);
        expect(
          await within(rankElement).findByText(
            _t(lastfmTranslations.flipCardReport.drawer.rank)
          )
        ).toBeTruthy();
        expect(await within(rankElement).findByText(": 1")).toBeTruthy();
      });

      it("should render the playcount correctly", async () => {
        const playCountElement = await screen.findByTestId(
          testIDs.LastFMDrawerPlayCount
        );
        expect(
          await within(playCountElement).findByText(
            _t(lastfmTranslations.flipCardReport.drawer.playCount)
          )
        ).toBeTruthy();
        expect(await within(playCountElement).findByText(": 0")).toBeTruthy();
      });

      it("should generate an analytics event", () => {
        expect(mockAnalyticsHook.event).toBeCalledTimes(1);
        expect(mockAnalyticsHook.event).toBeCalledWith(
          Events.LastFM.AlbumViewed(
            _t(lastfmTranslations.defaults.artistName),
            _t(lastfmTranslations.defaults.albumName)
          )
        );
      });

      describe("when there is an error loading the image", () => {
        let image: HTMLElement;

        beforeEach(async () => {
          image = await screen.findByAltText(
            mockT(currentProps.artWorkAltText)
          );
          expect(image).toHaveAttribute("src", MockImageUrl);
          fireEvent.error(image);
        });

        it("should set the image url to the fallback", () => {
          expect(image).toHaveAttribute("src", currentProps.fallbackImage);
        });
      });
    });

    describe("when the album info is complete", () => {
      beforeEach(() => {
        currentProps.userState.userProperties.data.report.albums = [
          {
            mbid: "some_mbid",
            name: "mock_album",
            image: [
              {
                "#text": MockImageUrl,
                size: "large",
              },
            ],
            artist: {
              mbid: "some_mbid",
              name: "mock_artist",
            },
            playcount: "100",
            url: "http://correcturl/for/this/album",
          },
        ];
        currentProps.objectIndex = 0;
        arrange();
      });

      checkBaseComponents(
        "http://correcturl/for/this/album",
        "mock_artist: mock_album"
      );

      it("should render the rank correctly", async () => {
        const rankElement = await screen.findByTestId(testIDs.LastFMDrawerRank);
        expect(
          await within(rankElement).findByText(
            _t(lastfmTranslations.flipCardReport.drawer.rank)
          )
        ).toBeTruthy();
        expect(await within(rankElement).findByText(": 1")).toBeTruthy();
      });

      it("should render the playcount correctly", async () => {
        const playCountElement = await screen.findByTestId(
          testIDs.LastFMDrawerPlayCount
        );
        expect(
          await within(playCountElement).findByText(
            _t(lastfmTranslations.flipCardReport.drawer.playCount)
          )
        ).toBeTruthy();
        expect(await within(playCountElement).findByText(": 100")).toBeTruthy();
      });

      it("should generate an analytics event", () => {
        expect(mockAnalyticsHook.event).toBeCalledTimes(1);
        expect(mockAnalyticsHook.event).toBeCalledWith(
          Events.LastFM.AlbumViewed("mock_artist", "mock_album")
        );
      });
    });
  });
});
