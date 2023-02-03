import { render } from "@testing-library/react";
import Top20ArtistsContainer from "../top20.artists.container";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import ImagesControllerProvider from "@src/providers/controllers/images/images.provider";
import FlipCardReportContainer from "@src/web/reports/lastfm/generics/components/report.component/flip.card/flip.card.report.container";
import mockLastFMHook from "@src/web/reports/lastfm/generics/state/hooks/__mocks__/lastfm.hook.mock";
import Top20ArtistsReport from "@src/web/reports/lastfm/top20.artists/state/queries/top20.artists.query.class";
import type { userHookAsLastFMTop20ArtistReport } from "@src/types/user/hook.types";

jest.mock(
  "@src/web/reports/lastfm/generics/components/report.component/flip.card/flip.card.report.container",
  () =>
    require("@fixtures/react/parent").createComponent("FlipCardReportContainer")
);

describe("Top20ArtistsReportContainer", () => {
  const mockUsername = "niall-byrne";

  beforeEach(() => {
    jest.clearAllMocks();

    arrange();
  });

  const arrange = () => {
    render(
      <ImagesControllerProvider>
        <Top20ArtistsContainer
          userName={mockUsername}
          lastfm={mockLastFMHook as userHookAsLastFMTop20ArtistReport}
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
        reportClass: Top20ArtistsReport,
      },
      0
    );
  });
});
