import { render } from "@testing-library/react";
import Top20ArtistsContainer from "../top20.artists.container";
import Top20ArtistsReport from "../top20.artists.report.class";
import FlipCardReportContainer from "@src/components/reports/lastfm/common/flip.card.report/flip.card.report.container";
import mockLastFMHook from "@src/hooks/tests/lastfm.mock.hook";
import UserInterfaceImageProvider from "@src/providers/ui/ui.images/ui.images.provider";
import type { userHookAsLastFMTop20ArtistReport } from "@src/types/user/hook.types";

jest.mock(
  "@src/components/reports/lastfm/common/flip.card.report/flip.card.report.container",
  () => require("@fixtures/react").createComponent("FlipCardReportContainer")
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
      <UserInterfaceImageProvider>
        <Top20ArtistsContainer
          userName={mockUsername}
          user={mockTypedLastFMHook}
        />
      </UserInterfaceImageProvider>
    );
  };

  it("should call the FlipCardReport component", () => {
    const call = (FlipCardReportContainer as jest.Mock).mock.calls[0][0];
    expect(call.user).toBe(mockTypedLastFMHook);
    expect(call.userName).toBe(mockUsername);
    expect(call.reportClass).toBe(Top20ArtistsReport);
  });
});
