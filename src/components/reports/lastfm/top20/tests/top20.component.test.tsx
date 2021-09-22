import { render, screen } from "@testing-library/react";
import translations from "../../../../../../public/locales/en/lastfm.json";
import checkMockCall from "../../../../../tests/fixtures/mock.component.call";
import FlipCard from "../../../../flip.card/flip.card.component";
import ReportTitle from "../../../common/report.title/report.title.component";
import AlbumDrawer from "../drawer.album/drawer.album.component";
import Top20Report, { Top20ReportProps } from "../top20.component";

jest.mock("../drawer.album/drawer.album.component", () => {
  return jest.fn(() => <div>{"MockAlbumDrawer"}</div>);
});

jest.mock("../../../../flip.card/flip.card.component", () => {
  return jest.fn(() => <div>{"MockFlipCard"}</div>);
});

jest.mock("../../../common/report.title/report.title.component", () => {
  return jest.fn(() => <div>{"MockReportTitle"}</div>);
});

const mockImageIsLoaded = jest.fn();
const mockUsername = "test-username";

const Top20ReportBaseProps: Top20ReportProps = {
  user: {
    userProperties: {
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
        integration: null,
      },
    },
    clear: jest.fn(),
    ready: jest.fn(),
    top20: jest.fn(),
  },
  imageIsLoaded: mockImageIsLoaded,
  visible: true,
};

describe("Top20Report", () => {
  let currentProps: Top20ReportProps;

  beforeEach(() => jest.clearAllMocks());

  const resetProps = () => {
    currentProps = { ...Top20ReportBaseProps };
  };

  const arrange = () => {
    return render(<Top20Report {...currentProps} />);
  };

  describe("when a data fetch is in progress", () => {
    beforeEach(() => {
      resetProps();
      currentProps.user.userProperties.inProgress = true;
      arrange();
    });

    it("should NOT call AlbumDrawer", () => {
      expect(AlbumDrawer).toBeCalledTimes(0);
    });

    it("should NOT call ReportTitle", () => {
      expect(ReportTitle).toBeCalledTimes(0);
    });

    it("should NOT call FlipCard", () => {
      expect(FlipCard).toBeCalledTimes(0);
    });
  });

  describe("when a data fetch is NOT in progress", () => {
    beforeEach(() => {
      resetProps();
      currentProps.user.userProperties.inProgress = false;
      currentProps.user.userProperties.data.report.albums = [
        {
          mbid: "some_mbid1",
          name: "mock_album1",
          artist: {
            mbid: "some_mbid1",
            name: "mock_artist1",
          },
          playcount: "101",
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
    });

    const checkComponents = () => {
      it("should call AlbumDrawer", () => {
        expect(AlbumDrawer).toBeCalledTimes(1);
        checkMockCall(
          AlbumDrawer,
          {
            albumIndex: null,
            albums: currentProps.user.userProperties.data.report.albums,
            fallbackImage: "/images/static.gif",
            isOpen: false,
          },
          0,
          ["onClose", "t", "top20GetAlbumArtWork"]
        );
      });

      it("should call ReportTitle", () => {
        expect(ReportTitle).toBeCalledTimes(1);
        checkMockCall(ReportTitle, {
          size: 100,
          title: translations.top20.title,
          userName: mockUsername,
        });
      });

      it("should call FlipCard", () => {
        expect(FlipCard).toBeCalledTimes(2);
        checkMockCall(
          FlipCard,
          {
            currentlyFlipped: null,
            fallbackImage: "/images/static.gif",
            image: "http://someurl1.com",
            index: 0,
            rearImage: "/images/record-player.jpg",
            size: 100,
          },
          0,
          ["flipperController", "imageIsLoaded", "t"]
        );
        checkMockCall(
          FlipCard,
          {
            currentlyFlipped: null,
            fallbackImage: "/images/static.gif",
            image: "http://someurl2.com",
            index: 1,
            rearImage: "/images/record-player.jpg",
            size: 100,
          },
          1,
          ["flipperController", "imageIsLoaded", "t"]
        );
      });
    };

    describe("when visible", () => {
      beforeEach(() => {
        resetProps();
        currentProps.visible = true;
        arrange();
      });

      checkComponents();

      it("the ReportTitle should be visible", async () => {
        const title = await screen.findByText("MockReportTitle");
        expect(title).toBeVisible();
      });
    });

    describe("when NOT visible", () => {
      beforeEach(() => {
        resetProps();
        currentProps.visible = false;
        arrange();
      });

      checkComponents();

      it("the ReportTitle should NOT be visible", async () => {
        const title = await screen.findByText("MockReportTitle");
        expect(title).not.toBeVisible();
      });
    });
  });
});