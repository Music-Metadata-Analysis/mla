import { act, render, screen } from "@testing-library/react";
import {
  mockImageUrl,
  mockGetReportArtWork,
  MockUserStateEncapsulation,
  MockDrawerComponent,
} from "./mock.last.fm.report.class";
import { MockReportClass } from "./mock.last.fm.report.class";
import checkMockCall from "../../../../../../tests/fixtures/mock.component.call";
import FlipCard from "../../../../../flip.card/flip.card.component";
import ReportTitle from "../../../../common/report.title/report.title.component";
import FlipCardReport, {
  FlipCardReportProps,
} from "../flip.card.report.component";

jest.mock("../../../../../flip.card/flip.card.component", () => {
  return jest.fn(() => <div>{"MockFlipCard"}</div>);
});

jest.mock("../../../../common/report.title/report.title.component", () => {
  return jest.fn(() => <div>{"MockReportTitle"}</div>);
});

jest.mock("next-i18next", () => {
  return {
    useTranslation: () => {
      return { t: (translationKey: string) => `t(${translationKey})` };
    },
  };
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
const mockTranslation = jest.fn(
  (translationKey: string) => `t(${translationKey})`
);

const FlipCardReportBaseProps: FlipCardReportProps<MockUserStateEncapsulation> =
  {
    userState: new MockUserStateEncapsulation(
      mockUserProperties,
      mockTranslation
    ),
    report: new MockReportClass(),
    imageIsLoaded: mockImageIsLoaded,
    visible: true,
    t: mockTranslation,
  };

describe("FlipCardReport", () => {
  let currentProps: FlipCardReportProps<MockUserStateEncapsulation>;

  beforeEach(() => jest.clearAllMocks());

  const resetProps = () => {
    currentProps = { ...FlipCardReportBaseProps };
  };

  const arrange = () => {
    return render(<FlipCardReport {...currentProps} />);
  };

  describe("when a data fetch is in progress", () => {
    beforeEach(() => {
      resetProps();
      currentProps.userState.userProperties.inProgress = true;
      arrange();
    });

    it("should NOT call MockDrawerComponent", () => {
      expect(MockDrawerComponent).toBeCalledTimes(0);
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
      currentProps.userState.userProperties.inProgress = false;
      currentProps.userState.userProperties.data.report.albums = [
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
      it("should NOT call MockDrawerComponent", () => {
        expect(MockDrawerComponent).toBeCalledTimes(0);
      });

      it("should call ReportTitle", () => {
        expect(ReportTitle).toBeCalledTimes(1);
        checkMockCall(ReportTitle, {
          size: 100,
          title: `t(${String(currentProps.report.translationKey)}.title)`,
          userName: mockUsername,
        });
      });

      it("should call getReportArtwork method of the user state encapsulation", () => {
        expect(mockGetReportArtWork).toBeCalledTimes(2);
        expect(mockGetReportArtWork).toBeCalledWith(0, "large");
        expect(mockGetReportArtWork).toBeCalledWith(1, "large");
      });

      it("should call FlipCard", () => {
        expect(FlipCard).toBeCalledTimes(2);
        checkMockCall(
          FlipCard,
          {
            currentlyFlipped: null,
            fallbackImage: "/images/static.gif",
            image: `${mockImageUrl}/0/large`,
            index: 0,
            rearImage: "/images/record-player.jpg",
            size: 100,
            noArtWork: `t(${String(
              currentProps.report.translationKey
            )}.noArtWork)`,
          },
          0,
          ["flipperController", "imageIsLoaded", "t"]
        );
        checkMockCall(
          FlipCard,
          {
            currentlyFlipped: null,
            fallbackImage: "/images/static.gif",
            image: `${mockImageUrl}/1/large`,
            index: 1,
            rearImage: "/images/record-player.jpg",
            size: 100,
            noArtWork: `t(${String(
              currentProps.report.translationKey
            )}.noArtWork)`,
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

      describe("when a card is flipped", () => {
        beforeEach(() => {
          const flipper = (FlipCard as jest.Mock).mock.calls[0][0]
            .flipperController;
          act(() => flipper(0));
        });

        it("should call AlbumDrawer", () => {
          expect(MockDrawerComponent).toBeCalledTimes(1);
          const call = (MockDrawerComponent as jest.Mock).mock.calls[0][0];
          expect(call.artWorkAltText).toBe(
            currentProps.report.getDrawerArtWorkAltText()
          );
          expect(call.objectIndex).toBe(0);
          expect(call.fallbackImage).toBe("/images/static.gif");
          expect(call.isOpen).toBe(true);
          expect(typeof call.onClose).toBe("function");
          expect(call.userState).toBeInstanceOf(MockUserStateEncapsulation);
          expect(call.userState.userProperties).toBe(
            currentProps.userState.userProperties
          );
          expect(call.t).toBe(currentProps.t);
          expect(Object.keys(call).length).toBe(7);
        });
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
