import { render } from "@testing-library/react";
import Top20ArtistsContainer from "../top20.artists.container";
import Top20ArtistsReport from "../top20.artists.report.class";
import FlipCardReportContainer from "@src/components/reports/lastfm/common/flip.card.report/flip.card.report.container";
import mockLastFMHook from "@src/hooks/__mocks__/lastfm.mock";
import ImagesControllerProvider from "@src/providers/controllers/images/images.provider";
import type { userHookAsLastFMTop20ArtistReport } from "@src/types/user/hook.types";

jest.mock(
  "@src/components/reports/lastfm/common/flip.card.report/flip.card.report.container",
  () =>
    require("@fixtures/react/parent").createComponent("FlipCardReportContainer")
);

describe("Top20ArtistsReportContainer", () => {
  const mockUsername = "niall-byrne";
  const mockTypedLastFMHook =
    mockLastFMHook as userHookAsLastFMTop20ArtistReport;

  beforeEach(() => {
    jest.clearAllMocks();
    arrange();
  });

  const arrange = () => {
    render(
      <ImagesControllerProvider>
        <Top20ArtistsContainer
          userName={mockUsername}
          user={mockTypedLastFMHook}
        />
      </ImagesControllerProvider>
    );
  };

  it("should call the FlipCardReport component", () => {
    const call = jest.mocked(FlipCardReportContainer).mock.calls[0][0];
    expect(call.user).toBe(mockTypedLastFMHook);
    expect(call.userName).toBe(mockUsername);
    expect(call.reportClass).toBe(Top20ArtistsReport);
    expect(Object.keys(call).length).toBe(3);
  });
});
