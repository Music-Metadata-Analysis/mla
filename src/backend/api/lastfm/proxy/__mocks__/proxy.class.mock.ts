import type { LastFMProxyInterface } from "@src/types/integrations/lastfm/proxy.types";

export const mockLastFMProxyMethods = {
  getAlbumInfo: jest.fn(),
  getArtistTopAlbums: jest.fn(),
  getTrackInfo: jest.fn(),
  getUserTopAlbums: jest.fn(),
  getUserTopArtists: jest.fn(),
  getUserTopTracks: jest.fn(),
} as Record<keyof LastFMProxyInterface, jest.Mock>;
