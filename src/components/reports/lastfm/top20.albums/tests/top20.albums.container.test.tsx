import { render } from "@testing-library/react";
import Top20AlbumsContainer from "../top20.albums.container";
import Top20AlbumsReport from "../top20.albums.report.class";
import FlipCardReportContainer from "@src/components/reports/lastfm/common/report.component/flip.card/flip.card.report.container";
import mockLastFMHook from "@src/hooks/__mocks__/lastfm.mock";
import ImagesControllerProvider from "@src/providers/controllers/images/images.provider";
import checkMockCall from "@src/tests/fixtures/mock.component.call";
import type { userHookAsLastFMTop20AlbumReport } from "@src/types/user/hook.types";

jest.mock(
  "@src/components/reports/lastfm/common/report.component/flip.card/flip.card.report.container",
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
