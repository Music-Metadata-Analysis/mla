import { render } from "@testing-library/react";
import FlipCardDrawer from "../flip.card.report.drawer.component";
import FlipCardDrawerContainer from "../flip.card.report.drawer.container";
import mockFlipCardController from "@src/components/reports/lastfm/common/report.component/flip.card/controllers/__mocks__/flip.card.controller.hook.mock";
import settings from "@src/config/flip.card";
import mockAnalyticsHook from "@src/hooks/__mocks__/analytics.hook.mock";
import { MockUseLocale } from "@src/hooks/__mocks__/locale.hook.mock";
import useLocale from "@src/hooks/locale.hook";
import UserAlbumState from "@src/providers/user/encapsulations/lastfm/flipcard/user.state.album.flipcard.report.class";
import checkMockCall from "@src/tests/fixtures/mock.component.call";
import type { LastFMFlipCardDrawerInterface } from "@src/types/reports/lastfm/components/drawers/flip.card.types";

jest.mock("@src/hooks/analytics.hook");

jest.mock("@src/hooks/locale.hook");

jest.mock(
  "@src/components/button/button.external.link/button.external.link.component",
  () => require("@fixtures/react/parent").createComponent("StyledButtonLink")
);

jest.mock("../flip.card.report.drawer.component", () =>
  require("@fixtures/react/parent").createComponent("FlipCardDrawer")
);

describe("FlipCardDrawerContainer", () => {
  let currentProps: LastFMFlipCardDrawerInterface<UserAlbumState>;

  const MockImageUrl = "MockImageUrl";
  const mockReportState = {
    data: {
      integration: "LASTFM" as const,
      report: {
        albums: [
          {
            mbid: "some_mbid",
            name: "mock_album",
            image: [
              {
                "#text": MockImageUrl,
                size: "large" as const,
              },
            ],
            artist: {
              mbid: "some_mbid",
              name: "mock_artist",
            },
            playcount: "100",
            url: "http://correcturl/for/this/album",
          },
        ],
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

  const mockT = new MockUseLocale("lastfm").t;

  const baseProps: LastFMFlipCardDrawerInterface<UserAlbumState> = {
    artWorkAltTranslatedText: "artWorkAltTranslatedText",
    fallbackImage: "/fallback.jpeg",
    isOpen: mockFlipCardController.drawer.state,
    objectIndex: 0,
    onClose: mockFlipCardController.drawer.setFalse,
    reportStateInstance: new UserAlbumState(mockReportState, mockT),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    resetProps();
  });

  const resetProps = () => {
    jest.mocked(useLocale).mockReturnValueOnce({ t: mockT });
    currentProps = { ...baseProps };
  };

  const arrange = () => {
    render(<FlipCardDrawerContainer {...currentProps} />);
  };

  const checkEffectHookEmitsEvent = () => {
    describe("useEffect (analytics)", () => {
      it("should emit the expected analytics event", () => {
        expect(mockAnalyticsHook.event).toBeCalledTimes(1);
        expect(mockAnalyticsHook.event).toBeCalledWith(
          currentProps.reportStateInstance.getDrawerEvent(
            currentProps.objectIndex as number
          )
        );
      });
    });
  };

  const checkEffectHookDoesNotEmitEvent = () => {
    describe("useEffect (analytics)", () => {
      it("should NOT emit an analytics event", () => {
        expect(mockAnalyticsHook.event).toBeCalledTimes(0);
      });
    });
  };

  const checkFlipCardDrawerProps = () => {
    it("should render the FlipCardDrawer component with the correct props", () => {
      expect(FlipCardDrawer).toBeCalledTimes(1);
      checkMockCall(
        FlipCardDrawer,
        {
          artWorkAltTranslatedText: currentProps.artWorkAltTranslatedText,
          artWorkSourceUrl: currentProps.reportStateInstance.getArtwork(
            currentProps.objectIndex as number,
            settings.drawer.lastFMImageSize
          ),
          drawerTitle: currentProps.reportStateInstance.getDrawerTitle(
            currentProps.objectIndex as number
          ),
          externalLink: currentProps.reportStateInstance.getExternalLink(
            currentProps.objectIndex as number
          ),
          fallbackImage: currentProps.fallbackImage,
          isOpen: currentProps.isOpen,
          objectIndex: currentProps.objectIndex,
          onClose: currentProps.onClose,
          t: mockT,
          value: currentProps.reportStateInstance.getPlayCount(
            currentProps.objectIndex as number
          ),
        },
        0
      );
    });
  };

  const checkFlipCardDrawerNotRendered = () => {
    it("should NOT render the FlipCardDrawer component", () => {
      expect(FlipCardDrawer).toBeCalledTimes(0);
    });
  };

  describe("when an objectIndex representing a card is passed", () => {
    beforeEach(() => {
      currentProps.objectIndex = 0;

      arrange();
    });

    checkEffectHookEmitsEvent();
    checkFlipCardDrawerProps();
  });

  describe("when a null objectIndex is passed", () => {
    beforeEach(() => {
      currentProps.objectIndex = null;

      arrange();
    });

    checkEffectHookDoesNotEmitEvent();
    checkFlipCardDrawerNotRendered();
  });
});
