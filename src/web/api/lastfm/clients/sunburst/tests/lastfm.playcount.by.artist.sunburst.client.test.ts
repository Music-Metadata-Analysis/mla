import AlbumInfo from "../datapoints/lastfm.album.info.class";
import ArtistAlbums from "../datapoints/lastfm.artist.albums.class";
import UserArtistsAndProfile from "../datapoints/lastfm.user.artists.and.profile.class";
import LastFMPlayCountByArtistDataClient from "../lastfm.playcount.by.artist.sunburst.client.class";
import type LastFMReportPlayCountByArtistStateEncapsulation from "@src/web/reports/lastfm/playcount.by.artist/state/encapsulations/lastfm.report.encapsulation.playcount.by.artist.class";

describe("LastFMPlayCountByArtistDataClient", () => {
  const mockDispatch = jest.fn();
  const eventCreator = jest.fn();
  const mockState = jest.fn();

  describe("when instantiated", () => {
    let instance: LastFMPlayCountByArtistDataClient;

    describe("when instantiated", () => {
      beforeEach(
        () =>
          (instance = new LastFMPlayCountByArtistDataClient(
            mockDispatch,
            eventCreator,
            mockState as unknown as LastFMReportPlayCountByArtistStateEncapsulation
          ))
      );

      it("should have the expected datapoint classes", () => {
        expect(instance.dataPointClasses).toStrictEqual([
          AlbumInfo,
          ArtistAlbums,
          UserArtistsAndProfile,
        ]);
      });

      it("should have the correct event type configured", () => {
        expect(instance.eventType).toBe("PLAYCOUNT BY ARTIST");
      });
    });
  });
});
