import { render } from "@testing-library/react";
import Top20TracksContainer from "../top20.tracks.container";
import Top20TracksReport from "../top20.tracks.report.class";
import FlipCardReportContainer from "@src/components/reports/lastfm/common/flip.card.report/flip.card.report.container";
import mockLastFMHook from "@src/hooks/__mocks__/lastfm.mock";
import UserInterfaceImageProvider from "@src/providers/ui/ui.images/ui.images.provider";
import type { userHookAsLastFMTop20TrackReport } from "@src/types/user/hook.types";

jest.mock(
  "@src/components/reports/lastfm/common/flip.card.report/flip.card.report.container",
  () =>
    require("@fixtures/react/parent").createComponent("FlipCardReportContainer")
);

describe("Top20TracksReportContainer", () => {
  const mockUsername = "niall-byrne";
  const mockTypedLastFMHook =
    mockLastFMHook as userHookAsLastFMTop20TrackReport;

  beforeEach(() => {
    jest.clearAllMocks();
    arrange();
  });

  const arrange = () => {
    render(
      <UserInterfaceImageProvider>
        <Top20TracksContainer
          userName={mockUsername}
          user={mockTypedLastFMHook}
        />
      </UserInterfaceImageProvider>
    );
  };

  it("should call the FlipCardReport component", () => {
    const call = jest.mocked(FlipCardReportContainer).mock.calls[0][0];
    expect(call.user).toBe(mockTypedLastFMHook);
    expect(call.userName).toBe(mockUsername);
    expect(call.reportClass).toBe(Top20TracksReport);
    expect(Object.keys(call).length).toBe(3);
  });
});
