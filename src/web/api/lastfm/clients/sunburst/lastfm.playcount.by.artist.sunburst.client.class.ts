import AlbumInfo from "./datapoints/lastfm.album.info.class";
import ArtistAlbums from "./datapoints/lastfm.artist.albums.class";
import UserArtistsAndProfile from "./datapoints/lastfm.user.artists.and.profile.class";
import LastFMSunburstDataClient from "../bases/lastfm.api.sunburst.client.base.class";
import apiRoutes from "@src/config/apiRoutes";
import type { PlayCountByArtistReportInterface } from "@src/contracts/api/types/services/lastfm/aggregates/lastfm.playcount.by.artist.report.types";

class LastFMPlayCountByArtistDataClient extends LastFMSunburstDataClient<
  PlayCountByArtistReportInterface[]
> {
  dataPointClasses = [AlbumInfo, ArtistAlbums, UserArtistsAndProfile];
  defaultRoute = apiRoutes.v2.reports.lastfm.top20artists;
  eventType = "PLAYCOUNT BY ARTIST" as const;
}

export default LastFMPlayCountByArtistDataClient;
