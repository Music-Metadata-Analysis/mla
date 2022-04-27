import apiRoutes from "../../../../../../../config/apiRoutes";
import LastFMAlbumInfo from "../album.info";
import type UserSunBurstReportBaseState from "../../../../../../../providers/user/encapsulations/lastfm/sunburst/user.state.base.sunburst.report.class";

describe("LastFMAlbumInfo", () => {
  const mockDispatch = jest.fn();
  const mockEvent = jest.fn();
  const mockEncapsulation =
    jest.fn() as unknown as UserSunBurstReportBaseState<unknown>;
  let instance: LastFMAlbumInfo<unknown>;

  const arrange = () => {
    return new LastFMAlbumInfo(mockDispatch, mockEvent, mockEncapsulation);
  };

  describe("when a request returns not found", () => {
    beforeEach(() => {
      instance = arrange();
    });

    it("should have the correct api route configured", () => {
      expect(instance.route).toBe(apiRoutes.v2.data.artists.albumsGet);
    });

    it("should have the correct integration configured", () => {
      expect(instance.integration).toBe("LAST.FM");
    });

    it("should have the correct event type configured", () => {
      expect(instance.eventType).toBe("ALBUM INFO");
    });
  });
});
