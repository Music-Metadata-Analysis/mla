import AlbumInfo from "../datapoints/album.info";
import ArtistAlbums from "../datapoints/artist.albums";
import UserArtistsAndProfile from "../datapoints/user.artists.and.profile";
import LastFMPlayCountByArtistDataClient from "../playcount.by.artist.sunburst.client.class";
import type PlayCountByArtistState from "@src/web/reports/generics/state/providers/encapsulations/lastfm/sunburst/playcount.by.artist/user.state.playcount.by.artist.sunburst.report.class";

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
            mockState as unknown as PlayCountByArtistState
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
