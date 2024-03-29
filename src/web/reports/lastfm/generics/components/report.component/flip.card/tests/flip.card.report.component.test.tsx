import { Flex } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import FlipCardReport, {
  FlipCardReportProps,
} from "../flip.card.report.component";
import lastfmTranslations from "@locales/lastfm.json";
import settings from "@src/config/flip.card";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import {
  MockUseTranslation,
  _t,
} from "@src/web/locale/translation/hooks/__mocks__/translation.hook.mock";
import FlipCardContainer from "@src/web/reports/generics/components/report.base/flip.card/flip.card.container";
import ReportTitleContainer from "@src/web/reports/generics/components/report.title/report.title.container";
import mockFlipCardController from "@src/web/reports/lastfm/generics/components/report.component/flip.card/controllers/__mocks__/flip.card.controller.hook.mock";
import {
  mockImageUrl,
  mockGetReportArtWork,
  MockDrawerComponent,
  MockQueryClass,
  MockReportStateEncapsulation,
} from "@src/web/reports/lastfm/generics/state/queries/tests/implementations/concrete.last.fm.query.class";
import mockImageController from "@src/web/ui/images/state/controllers/__mocks__/images.controller.hook.mock";
import type { LastFMTopAlbumsReportResponseInterface } from "@src/contracts/api/types/services/lastfm/responses/reports/top/top.albums.types";

jest.mock("@chakra-ui/react", () =>
  require("@fixtures/chakra").createChakraMock(["Flex"])
);

jest.mock(
  "@src/web/reports/generics/components/report.base/flip.card/flip.card.container",
  () => require("@fixtures/react/child").createComponent("FlipCardContainer")
);

jest.mock(
  "@src/web/reports/generics/components/report.title/report.title.container",
  () => require("@fixtures/react/child").createComponent("ReportTitle")
);

describe("FlipCardReport", () => {
  let currentProps: FlipCardReportProps<
    MockReportStateEncapsulation,
    LastFMTopAlbumsReportResponseInterface["albums"]
  >;

  const mockReportState = {
    error: null,
    inProgress: false,
    profileUrl: null,
    ready: true,
    retries: 3,
    userName: "mock-user",
    data: {
      report: {
        albums: [],
        image: [],
        playcount: 0,
      },
      integration: "LASTFM" as const,
    },
  };

  const mockT = new MockUseTranslation("lastfm").t;

  const mockReportStateData = [
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

  const mockInitialProps: FlipCardReportProps<
    MockReportStateEncapsulation,
    LastFMTopAlbumsReportResponseInterface["albums"]
  > = {
    imageIsLoaded: mockImageController.load,
    flipCardController: mockFlipCardController,
    reportStateInstance: new MockReportStateEncapsulation(
      mockReportState,
      new MockUseTranslation("lastfm").t
    ),
    query: new MockQueryClass(),
    t: mockT,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    resetProps();
  });

  const resetProps = () => {
    currentProps = { ...mockInitialProps };
    currentProps.reportStateInstance.reportProperties.data.report.albums =
      mockReportStateData;
  };

  const arrange = () => {
    return render(<FlipCardReport {...currentProps} />);
  };

  const checkFlexComponent = ({
    expectedDisplay,
  }: {
    expectedDisplay: "inline" | "none";
  }) => {
    it("should render the Flex component as expected", () => {
      expect(Flex).toHaveBeenCalledTimes(3);
      checkMockCall(
        Flex,
        {
          height: "calc(100vh - 80px)",
          overflowY: "scroll",
          pt: 75,
          pl: 50,
          pr: 50,
          style: {
            display: expectedDisplay,
          },
        },
        0
      );
      checkMockCall(
        Flex,
        {
          alignItems: "baseline",
          justifyContent: "center",
        },
        1
      );
      checkMockCall(
        Flex,
        {
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          maxWidth: `${settings.maxWidth}px`,
        },
        2
      );
    });
  };

  const checkDrawerComponent = () => {
    it("should render the Drawer component as expected", () => {
      expect(MockDrawerComponent).toHaveBeenCalledTimes(1);
      checkMockCall(
        MockDrawerComponent,
        {
          artWorkAltTranslatedText: mockT(
            currentProps.query.getDrawerArtWorkAltTextTranslationKey()
          ),
          fallbackImage: "/images/static.gif",
          isOpen: currentProps.flipCardController.drawer.state,
          objectIndex: currentProps.flipCardController.card.state,
          onClose: currentProps.flipCardController.drawer.setFalse,
          reportStateInstance: currentProps.reportStateInstance,
        },
        0
      );
    });
  };

  const checkReportTitle = () => {
    it("should render the ReportTitleContainer component as expected", () => {
      expect(ReportTitleContainer).toHaveBeenCalledTimes(1);
      checkMockCall(ReportTitleContainer, {
        size: 100,
        title: _t(
          (
            lastfmTranslations[
              currentProps.query.getReportTranslationKey()
            ] as {
              title: string;
            }
          ).title
        ),
        userName: currentProps.reportStateInstance.reportProperties.userName,
      });
    });
  };

  const checkFlipCardComponents = () => {
    describe("for each report data element passed in the ReportStateInstance", () => {
      it("should call the getReportArtwork method", () => {
        expect(mockGetReportArtWork).toHaveBeenCalledTimes(
          currentProps.reportStateInstance.reportProperties.data.report.albums
            .length
        );

        currentProps.reportStateInstance.reportProperties.data.report.albums.forEach(
          (_, elementIndex) => {
            expect(mockGetReportArtWork).toHaveBeenCalledWith(
              elementIndex,
              "large"
            );
          }
        );
      });

      it("should render a FlipCard component", () => {
        expect(FlipCardContainer).toHaveBeenCalledTimes(
          currentProps.reportStateInstance.reportProperties.data.report.albums
            .length
        );

        currentProps.reportStateInstance.reportProperties.data.report.albums.forEach(
          (_, elementIndex) => {
            checkMockCall(
              FlipCardContainer,
              {
                cardSize: settings.cardSize,
                currentlyFlipped: currentProps.flipCardController.card.state,
                flipCard: currentProps.flipCardController.card.flip,
                imageFrontFallBack: "/images/static.gif",
                imageFrontSrc: `${mockImageUrl}/${elementIndex}/large`,
                imageRearSrc: "/images/record-player.jpg",
                index: elementIndex,
                onLoad: currentProps.imageIsLoaded,
                noArtWorkText: _t(
                  (
                    lastfmTranslations[
                      currentProps.query.getReportTranslationKey()
                    ] as {
                      noArtWork: string;
                    }
                  ).noArtWork
                ),
              },
              elementIndex
            );
          }
        );
      });
    });
  };

  describe("when the report is ready to view", () => {
    beforeEach(() => {
      currentProps.reportStateInstance.reportProperties.ready = true;

      arrange();
    });

    checkFlexComponent({ expectedDisplay: "inline" });
    checkReportTitle();
    checkDrawerComponent();
    checkFlipCardComponents();

    it("the ReportTitle component should be visible", async () => {
      const title = await screen.findByText("ReportTitle");
      expect(title).toBeVisible();
    });
  });

  describe("when the report is NOT ready to view", () => {
    beforeEach(() => {
      currentProps.reportStateInstance.reportProperties.ready = false;

      arrange();
    });

    checkFlexComponent({ expectedDisplay: "none" });
    checkReportTitle();
    checkDrawerComponent();
    checkFlipCardComponents();

    it("the ReportTitle component should NOT be visible", async () => {
      const title = await screen.findByText("ReportTitle");
      expect(title).not.toBeVisible();
    });
  });
});
