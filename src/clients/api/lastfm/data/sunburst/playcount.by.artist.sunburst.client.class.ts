import AlbumInfo from "./datapoints/album.info";
import ArtistAlbums from "./datapoints/artist.albums";
import UserArtistsAndProfile from "./datapoints/user.artists.and.profile";
import LastFMSunburstDataClient from "./sunburst.client.base.class";
import apiRoutes from "@src/config/apiRoutes";
import type { PlayCountByArtistReportInterface } from "@src/types/reports/lastfm/states/aggregates/playcount.by.artist.types";

class LastFMPlayCountByArtistDataClient extends LastFMSunburstDataClient<
  PlayCountByArtistReportInterface[]
> {
  dataPointClasses = [AlbumInfo, ArtistAlbums, UserArtistsAndProfile];
  defaultRoute = apiRoutes.v2.reports.lastfm.top20artists;
  eventType = "PLAYCOUNT BY ARTIST" as const;
}

export default LastFMPlayCountByArtistDataClient;
