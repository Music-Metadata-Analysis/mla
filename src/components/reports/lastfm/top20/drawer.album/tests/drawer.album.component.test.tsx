import {
  Box,
  Divider,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerCloseButton,
  DrawerContent,
  Img,
} from "@chakra-ui/react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import mockColourHook from "../../../../../../hooks/tests/colour.hook.mock";
import checkMockCall from "../../../../../../tests/fixtures/mock.component.call";
import StyledButtonLink from "../../../../../button/button.link/button.link.component";
import AlbumDrawer, {
  AlbumDrawerInterface,
  testIDs,
} from "../drawer.album.component";

jest.mock("@chakra-ui/react", () => {
  const {
    factoryInstance,
  } = require("../../../../../../tests/fixtures/mock.chakra.react.factory.class");
  return factoryInstance.create([
    "Box",
    "Divider",
    "Drawer",
    "DrawerBody",
    "DrawerHeader",
    "DrawerOverlay",
    "DrawerCloseButton",
    "DrawerContent",
    "Img",
  ]);
});

jest.mock("../../../../../button/button.link/button.link.component", () => {
  const {
    factoryInstance,
  } = require("../../../../../../tests/fixtures/mock.component.children.factory.class");
  return factoryInstance.create("StyledButtonLink");
});

jest.mock("../../../../../../hooks/colour", () => {
  return () => mockColourHook;
});

const mockGetArtWork = jest.fn(() => "MockUrl");
const mockOnClose = jest.fn();

const baseProps: AlbumDrawerInterface = {
  albumIndex: null,
  albums: [],
  top20GetAlbumArtWork: mockGetArtWork,
  fallbackImage: "/fallback.jpeg",
  isOpen: true,
  onClose: mockOnClose,
  t: jest.fn((arg: string) => `t(${arg})`),
};

describe("AlbumDrawer", () => {
  let currentProps: AlbumDrawerInterface;

  beforeEach(() => jest.clearAllMocks());

  const resetProps = () => {
    currentProps = { ...baseProps };
  };

  const arrange = () => {
    return render(<AlbumDrawer {...currentProps} />);
  };

  const checkBaseComponents = (externalLink: string) => {
    it("should call Drawer once", () => {
      expect(Drawer).toBeCalledTimes(1);
      checkMockCall(
        Drawer,
        {
          "data-testid": testIDs.AlbumDrawer,
          isOpen: true,
          placement: "bottom",
        },
        0,
        ["onClose"]
      );
    });

    it("should call DrawerOverlay once", () => {
      expect(DrawerOverlay).toBeCalledTimes(1);
    });

    it("should call DrawerContent once", () => {
      expect(DrawerContent).toBeCalledTimes(1);
      checkMockCall(
        DrawerContent,
        {
          bg: mockColourHook.componentColour.background,
          color: mockColourHook.componentColour.foreground,
          colorScheme: mockColourHook.componentColour.scheme,
          sx: {
            caretColor: mockColourHook.transparent,
          },
        },
        0
      );
    });

    it("should call DrawerBody once", () => {
      expect(DrawerBody).toBeCalledTimes(1);
    });

    it("should call DrawerCloseButton once", () => {
      expect(DrawerCloseButton).toBeCalledTimes(1);
      checkMockCall(
        DrawerCloseButton,
        {
          "data-testid": testIDs.AlbumDrawerCloseButton,
          sx: {
            boxShadow: "none !important",
          },
        },
        0
      );
    });

    it("should call DrawerHeader once", () => {
      expect(DrawerHeader).toBeCalledTimes(1);
    });

    it("should call Divider 3 times", () => {
      expect(Divider).toBeCalledTimes(3);
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
          alt: "t(top20.drawer.coverArtAltText)",
          src: "MockUrl",
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

    describe("when albumIndex is null", () => {
      beforeEach(() => {
        currentProps.albumIndex = null;
        arrange();
      });

      it("should NOT call Drawer", () => {
        expect(Drawer).toBeCalledTimes(0);
      });
    });

    describe("when albumIndex is NOT null", () => {
      beforeEach(() => {
        currentProps.albumIndex = 0;
      });

      describe("when the album info is NOT complete", () => {
        beforeEach(() => {
          currentProps.albums = [
            {
              mbid: "some_mbid",
            },
          ];
          currentProps.albumIndex = 0;
          arrange();
        });

        checkBaseComponents(
          "https://last.fm/music/t(top20.drawer.unknownArtist)/t(top20.drawer.unknownAlbum)"
        );

        it("should render a title with defaults", async () => {
          expect(
            await screen.findByText(
              "t(top20.drawer.unknownArtist): t(top20.drawer.unknownAlbum)"
            )
          ).toBeTruthy();
        });

        it("should render the rank correctly", async () => {
          const rankElement = await screen.findByTestId(
            testIDs.AlbumDrawerRank
          );
          expect(
            await within(rankElement).findByText("t(top20.drawer.rank)")
          ).toBeTruthy();
          expect(await within(rankElement).findByText(": 1")).toBeTruthy();
        });

        it("should render the playcount correctly", async () => {
          const playCountElement = await screen.findByTestId(
            testIDs.AlbumDrawerPlayCount
          );
          expect(
            await within(playCountElement).findByText(
              "t(top20.drawer.playCount)"
            )
          ).toBeTruthy();
          expect(await within(playCountElement).findByText(": 0")).toBeTruthy();
        });

        describe("when there is an error loading the image", () => {
          let image: HTMLElement;

          beforeEach(async () => {
            image = await screen.findByAltText(
              "t(top20.drawer.coverArtAltText)"
            );
            expect(image).toHaveAttribute("src", "MockUrl");
            fireEvent.error(image);
          });

          it("should set the image url to the fallback", () => {
            expect(image).toHaveAttribute("src", currentProps.fallbackImage);
          });
        });
      });

      describe("when the album info is complete", () => {
        beforeEach(() => {
          currentProps.albums = [
            {
              mbid: "some_mbid",
              name: "mock_album",
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

        it("should render a title with defaults", async () => {
          expect(
            await screen.findAllByText("mock_artist: mock_album")
          ).toBeTruthy();
        });

        it("should render the rank correctly", async () => {
          const rankElement = await screen.findByTestId(
            testIDs.AlbumDrawerRank
          );
          expect(
            await within(rankElement).findByText("t(top20.drawer.rank)")
          ).toBeTruthy();
          expect(await within(rankElement).findByText(": 1")).toBeTruthy();
        });

        it("should render the playcount correctly", async () => {
          const playCountElement = await screen.findByTestId(
            testIDs.AlbumDrawerPlayCount
          );
          expect(
            await within(playCountElement).findByText(
              "t(top20.drawer.playCount)"
            )
          ).toBeTruthy();
          expect(
            await within(playCountElement).findByText(": 100")
          ).toBeTruthy();
        });
      });
    });
  });

  describe("when isOpen is false", () => {
    beforeEach(() => {
      resetProps();
      currentProps.isOpen = false;
    });

    describe("when albumIndex is NOT null", () => {
      beforeEach(() => {
        currentProps.albums = [
          {
            mbid: "some_mbid",
          },
        ];
        currentProps.albumIndex = 0;
        arrange();
      });

      it("should call Drawer once", () => {
        expect(Drawer).toBeCalledTimes(1);
        checkMockCall(
          Drawer,
          {
            "data-testid": testIDs.AlbumDrawer,
            isOpen: false,
            placement: "bottom",
          },
          0,
          ["onClose"]
        );
      });

      it("should NOT call DrawerOverlay", () => {
        expect(DrawerOverlay).toBeCalledTimes(0);
      });
    });
  });
});
