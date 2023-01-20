import LastFmAlbumClientAdapter from "./client/album.class";
import LastFmArtistClientAdapter from "./client/artist.class";
import LastFmTrackClientAdapter from "./client/track.class";
import LastFmUserClientAdapter from "./client/user.class";
import type { LastFMProxyInterface } from "@src/backend/api/types/services/lastfm/proxy.types";
import type { LastFMAlbumInfoInterface } from "@src/contracts/api/types/services/lastfm/responses/datapoints/album.info.types";
import type { LastFMArtistTopAlbumsInterface } from "@src/contracts/api/types/services/lastfm/responses/datapoints/artist.topalbums.types";
import type { LastFMTrackInfoInterface } from "@src/contracts/api/types/services/lastfm/responses/datapoints/track.info.types";
import type { LastFMTopAlbumsReportResponseInterface } from "@src/contracts/api/types/services/lastfm/responses/reports/top/top.albums.types";
import type { LastFMTopArtistsReportResponseInterface } from "@src/contracts/api/types/services/lastfm/responses/reports/top/top.artists.types";
import type { LastFMTopTracksReportResponseInterface } from "@src/contracts/api/types/services/lastfm/responses/reports/top/top.tracks.types";

class LastFMProxy implements LastFMProxyInterface {
  protected albumClient: LastFmAlbumClientAdapter;
  protected artistClient: LastFmArtistClientAdapter;
  protected trackClient: LastFmTrackClientAdapter;
  protected userClient: LastFmUserClientAdapter;

  constructor() {
    this.albumClient = new LastFmAlbumClientAdapter(process.env.LAST_FM_KEY);
    this.artistClient = new LastFmArtistClientAdapter(process.env.LAST_FM_KEY);
    this.trackClient = new LastFmTrackClientAdapter(process.env.LAST_FM_KEY);
    this.userClient = new LastFmUserClientAdapter(process.env.LAST_FM_KEY);
  }

  public async getAlbumInfo(
    artist: string,
    album: string,
    username: string
  ): Promise<LastFMAlbumInfoInterface> {
    const albumInfo = await this.albumClient.getInfo(artist, album, username);
    // data cleaning normalization
    return albumInfo;
  }

  public async getArtistTopAlbums(
    artist: string
  ): Promise<LastFMArtistTopAlbumsInterface[]> {
    const albums = await this.artistClient.getTopAlbums(artist);
    // data cleaning normalization
    return albums;
  }

  public async getTrackInfo(
    artist: string,
    track: string,
    username: string
  ): Promise<LastFMTrackInfoInterface> {
    const trackInfo = await this.trackClient.getInfo(artist, track, username);
    // data cleaning normalization
    return trackInfo;
  }

  public async getUserTopAlbums(
    username: string
  ): Promise<LastFMTopAlbumsReportResponseInterface> {
    const [albums, profile] = await Promise.all([
      this.userClient.getTopAlbums(username),
      this.userClient.getUserProfile(username),
    ]);

    return {
      albums,
      image: profile.image,
      playcount: profile.playcount,
    };
  }

  public async getUserTopArtists(
    username: string
  ): Promise<LastFMTopArtistsReportResponseInterface> {
    const [artists, profile] = await Promise.all([
      this.userClient.getTopArtists(username),
      this.userClient.getUserProfile(username),
    ]);
    return {
      artists,
      image: profile.image,
      playcount: profile.playcount,
    };
  }

  public async getUserTopTracks(
    username: string
  ): Promise<LastFMTopTracksReportResponseInterface> {
    const [tracks, profile] = await Promise.all([
      this.userClient.getTopTracks(username),
      this.userClient.getUserProfile(username),
    ]);
    return {
      tracks,
      image: profile.image,
      playcount: profile.playcount,
    };
  }
}

export default LastFMProxy;
