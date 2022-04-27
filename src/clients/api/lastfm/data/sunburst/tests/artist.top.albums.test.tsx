import apiRoutes from "../../../../../../config/apiRoutes";
import LastFMArtistGetAlbums from "../artist.get.albums";
import type UserSunBurstReportBaseState from "../../../../../../providers/user/encapsulations/lastfm/sunburst/user.state.base.sunburst.report.class";
import type { LastFMArtistTopAlbumsInterface } from "../../../../../../types/integrations/lastfm/api.types";

describe("LastFMArtistGetAlbums", () => {
  const mockDispatch = jest.fn();
  const mockEvent = jest.fn();
  const mockEncapsulation =
    jest.fn() as unknown as UserSunBurstReportBaseState<LastFMArtistTopAlbumsInterface>;
  let instance: LastFMArtistGetAlbums;

  const arrange = () => {
    return new LastFMArtistGetAlbums(
      mockDispatch,
      mockEvent,
      mockEncapsulation
    );
  };

  describe("when a request returns not found", () => {
    beforeEach(() => {
      instance = arrange();
    });

    it("should have the correct api route configured", () => {
      expect(instance.route).toBe(apiRoutes.v2.data.artists.albumsList);
    });

    it("should have the correct integration configured", () => {
      expect(instance.integration).toBe("LAST.FM");
    });

    it("should have the correct event type configured", () => {
      expect(instance.eventType).toBe("ARTIST GET ALBUMS");
    });
  });
});
