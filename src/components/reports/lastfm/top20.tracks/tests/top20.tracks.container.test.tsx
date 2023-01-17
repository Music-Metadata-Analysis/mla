import { render } from "@testing-library/react";
import Top20TracksContainer from "../top20.tracks.container";
import Top20TracksReport from "../top20.tracks.report.class";
import FlipCardReportContainer from "@src/components/reports/lastfm/common/report.component/flip.card/flip.card.report.container";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import mockLastFMHook from "@src/hooks/__mocks__/lastfm.hook.mock";
import ImagesControllerProvider from "@src/providers/controllers/images/images.provider";
import type { userHookAsLastFMTop20TrackReport } from "@src/types/user/hook.types";

jest.mock(
  "@src/components/reports/lastfm/common/report.component/flip.card/flip.card.report.container",
  () =>
    require("@fixtures/react/parent").createComponent("FlipCardReportContainer")
);

describe("Top20TracksReportContainer", () => {
  const mockUsername = "niall-byrne";

  beforeEach(() => {
    jest.clearAllMocks();

    arrange();
  });

  const arrange = () => {
    render(
      <ImagesControllerProvider>
        <Top20TracksContainer
          userName={mockUsername}
          lastfm={mockLastFMHook as userHookAsLastFMTop20TrackReport}
        />
      </ImagesControllerProvider>
    );
  };

  it("should render the FlipCardReport component correctly", () => {
    expect(FlipCardReportContainer).toBeCalledTimes(1);
    checkMockCall(
      FlipCardReportContainer,
      {
        lastfm: mockLastFMHook,
        userName: mockUsername,
        reportClass: Top20TracksReport,
      },
      0
    );
  });
});
