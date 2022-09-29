import { render } from "@testing-library/react";
import Top20AlbumsContainer from "../top20.albums.container";
import Top20AlbumsReport from "../top20.albums.report.class";
import FlipCardReportContainer from "@src/components/reports/lastfm/common/flip.card.report/flip.card.report.container";
import mockLastFMHook from "@src/hooks/__mocks__/lastfm.mock";
import UserInterfaceImageProvider from "@src/providers/ui/ui.images/ui.images.provider";
import type { userHookAsLastFMTop20AlbumReport } from "@src/types/user/hook.types";

jest.mock(
  "@src/components/reports/lastfm/common/flip.card.report/flip.card.report.container",
  () =>
    require("@fixtures/react/parent").createComponent("FlipCardReportContainer")
);

describe("Top20AlbumsReportContainer", () => {
  const mockUsername = "niall-byrne";
  const mockTypedLastFMHook =
    mockLastFMHook as userHookAsLastFMTop20AlbumReport;

  beforeEach(() => {
    jest.clearAllMocks();
    arrange();
  });

  const arrange = () => {
    render(
      <UserInterfaceImageProvider>
        <Top20AlbumsContainer
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
    expect(call.reportClass).toBe(Top20AlbumsReport);
    expect(Object.keys(call).length).toBe(3);
  });
});
