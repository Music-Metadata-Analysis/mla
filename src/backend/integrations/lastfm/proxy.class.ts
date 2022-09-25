import LastFmAlbumClientAdapter from "./client/album.class";
import LastFmArtistClientAdapter from "./client/artist.class";
import LastFmTrackClientAdapter from "./client/track.class";
import LastFmUserClientAdapter from "./client/user.class";
import type { LastFMProxyInterface } from "@src/types/integrations/lastfm/proxy.types";

class LastFMProxy implements LastFMProxyInterface {
  private albumClient: LastFmAlbumClientAdapter;
  private artistClient: LastFmArtistClientAdapter;
  private trackClient: LastFmTrackClientAdapter;
  private userClient: LastFmUserClientAdapter;

  constructor() {
    this.albumClient = new LastFmAlbumClientAdapter(process.env.LAST_FM_KEY);
    this.artistClient = new LastFmArtistClientAdapter(process.env.LAST_FM_KEY);
    this.trackClient = new LastFmTrackClientAdapter(process.env.LAST_FM_KEY);
    this.userClient = new LastFmUserClientAdapter(process.env.LAST_FM_KEY);
  }

  async getAlbumInfo(artist: string, album: string, username: string) {
    const albumInfo = await this.albumClient.getInfo(artist, album, username);
    // data cleaning normalization
    return albumInfo;
  }

  async getArtistTopAlbums(artist: string) {
    const albums = await this.artistClient.getTopAlbums(artist);
    // data cleaning normalization
    return albums;
  }

  async getTrackInfo(artist: string, track: string, username: string) {
    const trackInfo = await this.trackClient.getInfo(artist, track, username);
    // data cleaning normalization
    return trackInfo;
  }

  async getUserTopAlbums(username: string) {
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

  async getUserTopArtists(username: string) {
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

  async getUserTopTracks(username: string) {
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
