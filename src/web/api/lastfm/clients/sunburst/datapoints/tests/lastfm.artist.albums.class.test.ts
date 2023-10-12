import LastFMArtistGetAlbums from "../lastfm.artist.albums.class";
import apiRoutes from "@src/config/apiRoutes";
import LastFMReportBaseClient from "@src/web/api/lastfm/clients/bases/lastfm.api.client.base.class";
import type LastFMReportSunBurstBaseStateEncapsulation from "@src/web/reports/lastfm/generics/state/encapsulations/lastfm.report.encapsulation.sunburst.base.class";

describe("LastFMArtistGetAlbums", () => {
  const mockDispatch = jest.fn();
  const mockEvent = jest.fn();
  const mockEncapsulation =
    jest.fn() as unknown as LastFMReportSunBurstBaseStateEncapsulation<unknown>;
  let instance: LastFMArtistGetAlbums<unknown>;

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

    it("should be an instance of the LastFMBaseClient abstract base class", () => {
      expect(instance).toBeInstanceOf(LastFMReportBaseClient);
    });

    it("should have the correct api route configured", () => {
      expect(instance.route).toBe(apiRoutes.v2.data.lastfm.artists.albumsList);
    });
  });
});
