import { render } from "@testing-library/react";
import mockLastFMHook from "../../../../../hooks/tests/lastfm.mock.hook";
import UserInterfaceImageProvider from "../../../../../providers/ui/ui.images/ui.images.provider";
import FlipCardReportContainer from "../../common/flip.card.report/flip.card.report.container";
import Top20AlbumsContainer from "../top20.albums.container";
import Top20AlbumsReport from "../top20.albums.report.class";
import type { userHookAsLastFMTop20AlbumReport } from "../../../../../types/user/hook.types";

jest.mock("../../common/flip.card.report/flip.card.report.container", () =>
  createMockedComponent("FlipCardReport")
);

const createMockedComponent = (name: string) => {
  const {
    factoryInstance,
  } = require("../../../../../tests/fixtures/mock.component.children.factory.class");
  return factoryInstance.create(name);
};

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
    const call = (FlipCardReportContainer as jest.Mock).mock.calls[0][0];
    expect(call.user).toBe(mockTypedLastFMHook);
    expect(call.userName).toBe(mockUsername);
    expect(call.reportClass).toBe(Top20AlbumsReport);
  });
});
