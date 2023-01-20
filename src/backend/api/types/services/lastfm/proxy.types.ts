import type { LastFMAlbumInfoInterface } from "@src/contracts/api/types/services/lastfm/responses/datapoints/album.info.types";
import type { LastFMArtistTopAlbumsInterface } from "@src/contracts/api/types/services/lastfm/responses/datapoints/artist.topalbums.types";
import type { LastFMTrackInfoInterface } from "@src/contracts/api/types/services/lastfm/responses/datapoints/track.info.types";
import type { LastFMTopAlbumsReportResponseInterface } from "@src/contracts/api/types/services/lastfm/responses/reports/top/top.albums.types";
import type { LastFMTopArtistsReportResponseInterface } from "@src/contracts/api/types/services/lastfm/responses/reports/top/top.artists.types";
import type { LastFMTopTracksReportResponseInterface } from "@src/contracts/api/types/services/lastfm/responses/reports/top/top.tracks.types";

export interface LastFMProxyInterface {
  getAlbumInfo: (
    artist: string,
    album: string,
    username: string
  ) => Promise<LastFMAlbumInfoInterface>;
  getArtistTopAlbums: (
    artist: string
  ) => Promise<LastFMArtistTopAlbumsInterface[]>;
  getTrackInfo: (
    track: string,
    artist: string,
    username: string
  ) => Promise<LastFMTrackInfoInterface>;
  getUserTopAlbums: (
    username: string
  ) => Promise<LastFMTopAlbumsReportResponseInterface>;
  getUserTopArtists: (
    username: string
  ) => Promise<LastFMTopArtistsReportResponseInterface>;
  getUserTopTracks: (
    username: string
  ) => Promise<LastFMTopTracksReportResponseInterface>;
}
