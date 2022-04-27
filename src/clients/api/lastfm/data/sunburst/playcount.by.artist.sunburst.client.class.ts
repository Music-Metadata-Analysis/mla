import AlbumInfo from "./datapoints/album.info";
import ArtistAlbums from "./datapoints/artist.albums";
import TrackInfo from "./datapoints/track.info";
import UserArtistsAndProfile from "./datapoints/user.artists.and.profile";
import LastFMSunburstDataClient from "./sunburst.client.base.class";
import apiRoutes from "../../../../../config/apiRoutes";
import type { PlayCountByArtistReportInterface } from "../../../../../types/clients/api/lastfm/response.types";

class LastFMPlayCountByArtistDataClient extends LastFMSunburstDataClient<
  PlayCountByArtistReportInterface[]
> {
  dataPointClasses = [
    AlbumInfo,
    ArtistAlbums,
    TrackInfo,
    UserArtistsAndProfile,
  ];
  defaultRoute = apiRoutes.v2.reports.lastfm.top20artists;
}

export default LastFMPlayCountByArtistDataClient;
