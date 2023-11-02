import { render } from "@testing-library/react";
import Top20TracksContainer from "../top20.tracks.container";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import FlipCardReportContainer from "@src/web/reports/lastfm/generics/components/report.component/flip.card/flip.card.report.container";
import mockLastFMHook from "@src/web/reports/lastfm/generics/state/hooks/__mocks__/lastfm.hook.mock";
import Top20TracksQuery from "@src/web/reports/lastfm/top20.tracks/state/queries/top20.tracks.query.class";
import ImagesControllerProvider from "@src/web/ui/images/state/providers/images.provider";
import type { reportHookAsLastFMTop20TrackReport } from "@src/web/reports/lastfm/generics/types/state/hooks/lastfm.hook.types";

jest.mock(
  "@src/web/reports/lastfm/generics/components/report.component/flip.card/flip.card.report.container",
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
          lastfm={mockLastFMHook as reportHookAsLastFMTop20TrackReport}
        />
      </ImagesControllerProvider>
    );
  };

  it("should render the FlipCardReport component correctly", () => {
    expect(FlipCardReportContainer).toHaveBeenCalledTimes(1);
    checkMockCall(
      FlipCardReportContainer,
      {
        lastfm: mockLastFMHook,
        userName: mockUsername,
        queryClass: Top20TracksQuery,
      },
      0
    );
  });
});
