import apiRoutes from "../../../../../../../config/apiRoutes";
import LastFMTrackInfo from "../track.info";
import type UserSunBurstReportBaseState from "../../../../../../../providers/user/encapsulations/lastfm/sunburst/user.state.base.sunburst.report.class";

describe("LastFMTrackInfo", () => {
  const mockDispatch = jest.fn();
  const mockEvent = jest.fn();
  const mockEncapsulation =
    jest.fn() as unknown as UserSunBurstReportBaseState<unknown>;
  let instance: LastFMTrackInfo<unknown>;

  const arrange = () => {
    return new LastFMTrackInfo(mockDispatch, mockEvent, mockEncapsulation);
  };

  describe("when a request returns not found", () => {
    beforeEach(() => {
      instance = arrange();
    });

    it("should have the correct api route configured", () => {
      expect(instance.route).toBe(apiRoutes.v2.data.artists.tracksGet);
    });

    it("should have the correct integration configured", () => {
      expect(instance.integration).toBe("LAST.FM");
    });

    it("should have the correct event type configured", () => {
      expect(instance.eventType).toBe("TRACK INFO");
    });
  });
});
