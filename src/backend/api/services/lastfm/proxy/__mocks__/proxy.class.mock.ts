import type { LastFMProxyInterface } from "@src/backend/api/types/services/lastfm/proxy.types";

export const mockLastFMProxyMethods = {
  getAlbumInfo: jest.fn(),
  getArtistTopAlbums: jest.fn(),
  getTrackInfo: jest.fn(),
  getUserTopAlbums: jest.fn(),
  getUserTopArtists: jest.fn(),
  getUserTopTracks: jest.fn(),
} as Record<keyof LastFMProxyInterface, jest.Mock>;
