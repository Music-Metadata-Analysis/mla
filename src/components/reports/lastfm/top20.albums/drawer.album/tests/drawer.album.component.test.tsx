import { Box, Divider, Img } from "@chakra-ui/react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import EventDefinition from "../../../../../../events/event.class";
import mockAnalyticsHook from "../../../../../../hooks/tests/analytics.mock";
import mockColourHook from "../../../../../../hooks/tests/colour.hook.mock";
import UserAlbumState from "../../../../../../providers/user/encapsulations/user.state.album.class";
import checkMockCall from "../../../../../../tests/fixtures/mock.component.call";
import StyledButtonLink from "../../../../../button/button.link/button.link.component";
import Drawer from "../../../../common/drawer/drawer.component";
import AlbumDrawer, {
  AlbumDrawerInterface,
  testIDs,
} from "../drawer.album.component";

jest.mock("../../../../../../hooks/analytics", () => ({
  __esModule: true,
  default: () => mockAnalyticsHook,
}));

jest.mock("@chakra-ui/react", () => {
  const {
    factoryInstance,
  } = require("../../../../../../tests/fixtures/mock.chakra.react.factory.class");
  return factoryInstance.create(["Box", "Divider", "Img"]);
});

jest.mock("../../../../../button/button.link/button.link.component", () => {
  const {
    factoryInstance,
  } = require("../../../../../../tests/fixtures/mock.component.children.factory.class");
  return factoryInstance.create("StyledButtonLink");
});

jest.mock("../../../../common/drawer/drawer.component", () => {
  const {
    factoryInstance,
  } = require("../../../../../../tests/fixtures/mock.component.children.factory.class");
  return factoryInstance.create("MockDrawer");
});

jest.mock("../../../../../../hooks/colour", () => {
  return () => mockColourHook;
});

const mockOnClose = jest.fn();
const mockT = jest.fn((arg: string) => `t(${arg})`);
const mockBaseUserProperties = {
  data: {
    integration: null,
    report: {
      albums: [],
      image: [],
    },
  },
  error: null,
  inProgress: false,
  profileUrl: null,
  ready: true,
  userName: null,
};

const mockState = new UserAlbumState(mockBaseUserProperties, mockT);

const baseProps: AlbumDrawerInterface = {
  albumIndex: 0,
  userState: mockState,
  fallbackImage: "/fallback.jpeg",
  isOpen: true,
  onClose: mockOnClose,
  t: mockT,
};

describe("AlbumDrawer", () => {
  let currentProps: AlbumDrawerInterface;
  const MockImageUrl = "MockImageUrl";

  beforeEach(() => jest.clearAllMocks());

  const resetProps = () => {
    baseProps.userState = new UserAlbumState(mockBaseUserProperties, mockT);
    currentProps = { ...baseProps };
  };

  const arrange = () => {
    render(<AlbumDrawer {...currentProps} />);
  };

  const checkBaseComponents = (externalLink: string) => {
    it("should call Drawer once", () => {
      expect(Drawer).toBeCalledTimes(1);
      checkMockCall(
        Drawer,
        {
          "data-testid": testIDs.AlbumDrawer,
          isOpen: true,
          title: "t(defaults.artistName): t(defaults.albumName)",
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
      checkMockCall(
        Box,
        {
          borderColor: mockColourHook.componentColour.details,
          borderWidth: "1px",
        },
        0
      );
    });

    it("should call Img once", () => {
      expect(Img).toBeCalledTimes(1);
      checkMockCall(
        Img,
        {
          alt: "t(top20Albums.drawer.coverArtAltText)",
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
        currentProps.albumIndex = 0;
        arrange();
      });

      checkBaseComponents(
        "https://last.fm/music/t(defaults.artistName)/t(defaults.albumName)"
      );

      it("should render the rank correctly", async () => {
        const rankElement = await screen.findByTestId(testIDs.AlbumDrawerRank);
        expect(
          await within(rankElement).findByText("t(top20Albums.drawer.rank)")
        ).toBeTruthy();
        expect(await within(rankElement).findByText(": 1")).toBeTruthy();
      });

      it("should render the playcount correctly", async () => {
        const playCountElement = await screen.findByTestId(
          testIDs.AlbumDrawerPlayCount
        );
        expect(
          await within(playCountElement).findByText(
            "t(top20Albums.drawer.playCount)"
          )
        ).toBeTruthy();
        expect(await within(playCountElement).findByText(": 0")).toBeTruthy();
      });

      it("should generate an analytics event", () => {
        expect(mockAnalyticsHook.event).toBeCalledTimes(1);
        expect(mockAnalyticsHook.event).toBeCalledWith(
          new EventDefinition({
            action:
              "VIEW ALBUM DETAILS: t(defaults.artistName):t(defaults.albumName)",
            category: "LAST.FM",
            label: "DATA: ALBUM",
            value: undefined,
          })
        );
      });

      describe("when there is an error loading the image", () => {
        let image: HTMLElement;

        beforeEach(async () => {
          image = await screen.findByAltText(
            "t(top20Albums.drawer.coverArtAltText)"
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
        currentProps.albumIndex = 0;
        arrange();
      });

      checkBaseComponents("http://correcturl/for/this/album");

      it("should render the rank correctly", async () => {
        const rankElement = await screen.findByTestId(testIDs.AlbumDrawerRank);
        expect(
          await within(rankElement).findByText("t(top20Albums.drawer.rank)")
        ).toBeTruthy();
        expect(await within(rankElement).findByText(": 1")).toBeTruthy();
      });

      it("should render the playcount correctly", async () => {
        const playCountElement = await screen.findByTestId(
          testIDs.AlbumDrawerPlayCount
        );
        expect(
          await within(playCountElement).findByText(
            "t(top20Albums.drawer.playCount)"
          )
        ).toBeTruthy();
        expect(await within(playCountElement).findByText(": 100")).toBeTruthy();
      });

      it("should generate an analytics event", () => {
        expect(mockAnalyticsHook.event).toBeCalledTimes(1);
        expect(mockAnalyticsHook.event).toBeCalledWith(
          new EventDefinition({
            action: "VIEW ALBUM DETAILS: mock_artist:mock_album",
            category: "LAST.FM",
            label: "DATA: ALBUM",
            value: undefined,
          })
        );
      });
    });
  });
});
