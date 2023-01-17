import { Flex } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import FlipCardReport, {
  FlipCardReportProps,
} from "../flip.card.report.component";
import lastfmTranslations from "@locales/lastfm.json";
import FlipCardContainer from "@src/components/flip.card/flip.card.container";
import ReportTitleContainer from "@src/components/reports/common/report.title/report.title.container";
import {
  mockImageUrl,
  mockGetReportArtWork,
  MockDrawerComponent,
  MockReportClass,
  MockUserStateEncapsulation,
} from "@src/components/reports/lastfm/common/report.class/tests/implementations/concrete.last.fm.report.class";
import mockFlipCardController from "@src/components/reports/lastfm/common/report.component/flip.card/controllers/__mocks__/flip.card.controller.hook.mock";
import settings from "@src/config/flip.card";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import { MockUseLocale, _t } from "@src/hooks/__mocks__/locale.hook.mock";
import mockImageController from "@src/hooks/controllers/__mocks__/images.controller.hook.mock";
import type { LastFMTopAlbumsReportResponseInterface } from "@src/types/clients/api/lastfm/response.types";

jest.mock("@chakra-ui/react", () =>
  require("@fixtures/chakra").createChakraMock(["Flex"])
);

jest.mock("@src/components/flip.card/flip.card.container", () =>
  require("@fixtures/react/child").createComponent("FlipCardContainer")
);

jest.mock(
  "@src/components/reports/common/report.title/report.title.container",
  () => require("@fixtures/react/child").createComponent("ReportTitle")
);

describe("FlipCardReport", () => {
  let currentProps: FlipCardReportProps<
    MockUserStateEncapsulation,
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

  const mockT = new MockUseLocale("lastfm").t;

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
    MockUserStateEncapsulation,
    LastFMTopAlbumsReportResponseInterface["albums"]
  > = {
    imageIsLoaded: mockImageController.load,
    flipCardController: mockFlipCardController,
    reportStateInstance: new MockUserStateEncapsulation(
      mockReportState,
      new MockUseLocale("lastfm").t
    ),
    report: new MockReportClass(),
    t: mockT,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    resetProps();
  });

  const resetProps = () => {
    currentProps = { ...mockInitialProps };
    currentProps.reportStateInstance.userProperties.data.report.albums =
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
      expect(Flex).toBeCalledTimes(3);
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
      expect(MockDrawerComponent).toBeCalledTimes(1);
      checkMockCall(
        MockDrawerComponent,
        {
          artWorkAltTranslatedText: mockT(
            currentProps.report.getDrawerArtWorkAltTextTranslationKey()
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
      expect(ReportTitleContainer).toBeCalledTimes(1);
      checkMockCall(ReportTitleContainer, {
        size: 100,
        title: _t(
          (
            lastfmTranslations[
              currentProps.report.getReportTranslationKey()
            ] as {
              title: string;
            }
          ).title
        ),
        userName: currentProps.reportStateInstance.userProperties.userName,
      });
    });
  };

  const checkFlipCardComponents = () => {
    describe("for each report data element passed in the ReportStateInstance", () => {
      it("should call the getReportArtwork method", () => {
        expect(mockGetReportArtWork).toBeCalledTimes(
          currentProps.reportStateInstance.userProperties.data.report.albums
            .length
        );

        currentProps.reportStateInstance.userProperties.data.report.albums.forEach(
          (_, elementIndex) => {
            expect(mockGetReportArtWork).toBeCalledWith(elementIndex, "large");
          }
        );
      });

      it("should render a FlipCard component", () => {
        expect(FlipCardContainer).toBeCalledTimes(
          currentProps.reportStateInstance.userProperties.data.report.albums
            .length
        );

        currentProps.reportStateInstance.userProperties.data.report.albums.forEach(
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
                      currentProps.report.getReportTranslationKey()
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
      currentProps.reportStateInstance.userProperties.ready = true;

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
      currentProps.reportStateInstance.userProperties.ready = false;

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
