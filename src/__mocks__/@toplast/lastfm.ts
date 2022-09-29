export const mockVendorMethods = {
  album: {
    getInfo: jest.fn(),
  },
  artist: {
    getTopAlbums: jest.fn(),
  },
  track: {
    getInfo: jest.fn(),
  },
  user: {
    getInfo: jest.fn(),
    getTopAlbums: jest.fn(),
    getTopArtists: jest.fn(),
    getTopTracks: jest.fn(),
  },
};

export default jest.fn(() => mockVendorMethods);
