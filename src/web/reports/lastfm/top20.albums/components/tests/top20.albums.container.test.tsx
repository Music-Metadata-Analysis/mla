import { render } from "@testing-library/react";
import Top20AlbumsContainer from "../top20.albums.container";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import FlipCardReportContainer from "@src/web/reports/lastfm/generics/components/report.component/flip.card/flip.card.report.container";
import mockLastFMHook from "@src/web/reports/lastfm/generics/state/hooks/__mocks__/lastfm.hook.mock";
import Top20AlbumsQuery from "@src/web/reports/lastfm/top20.albums/state/queries/top20.albums.query.class";
import ImagesControllerProvider from "@src/web/ui/images/state/providers/images.provider";
import type { reportHookAsLastFMTop20AlbumReport } from "@src/web/reports/lastfm/generics/types/state/hooks/lastfm.hook.types";

jest.mock(
  "@src/web/reports/lastfm/generics/components/report.component/flip.card/flip.card.report.container",
  () =>
    require("@fixtures/react/parent").createComponent("FlipCardReportContainer")
);

describe("Top20AlbumsReportContainer", () => {
  const mockUsername = "niall-byrne";

  beforeEach(() => {
    jest.clearAllMocks();

    arrange();
  });

  const arrange = () => {
    render(
      <ImagesControllerProvider>
        <Top20AlbumsContainer
          userName={mockUsername}
          lastfm={mockLastFMHook as reportHookAsLastFMTop20AlbumReport}
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
        queryClass: Top20AlbumsQuery,
      },
      0
    );
  });
});
