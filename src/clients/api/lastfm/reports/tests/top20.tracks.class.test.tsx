import LastFMReport from "../top20.tracks.class";
import apiRoutes from "@src/config/apiRoutes";

describe("LastFMTopTracksReport", () => {
  const mockDispatch = jest.fn();
  const mockEvent = jest.fn();
  let instance: LastFMReport;

  const arrange = () => {
    return new LastFMReport(mockDispatch, mockEvent);
  };

  describe("when a request returns not found", () => {
    beforeEach(() => {
      instance = arrange();
    });

    it("should have the correct api route configured", () => {
      expect(instance.route).toBe(apiRoutes.v2.reports.lastfm.top20tracks);
    });

    it("should have the correct integration configured", () => {
      expect(instance.integration).toBe("LAST.FM");
    });

    it("should have the correct event type configured", () => {
      expect(instance.eventType).toBe("TOP20 TRACKS");
    });
  });
});
