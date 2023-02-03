import { render } from "@testing-library/react";
import Top20AlbumsContainer from "../top20.albums.container";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import ImagesControllerProvider from "@src/providers/controllers/images/images.provider";
import FlipCardReportContainer from "@src/web/reports/lastfm/generics/components/report.component/flip.card/flip.card.report.container";
import mockLastFMHook from "@src/web/reports/lastfm/generics/state/hooks/__mocks__/lastfm.hook.mock";
import Top20AlbumsReport from "@src/web/reports/lastfm/top20.albums/state/queries/top20.albums.query.class";
import type { userHookAsLastFMTop20AlbumReport } from "@src/types/user/hook.types";

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
          lastfm={mockLastFMHook as userHookAsLastFMTop20AlbumReport}
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
        reportClass: Top20AlbumsReport,
      },
      0
    );
  });
});
