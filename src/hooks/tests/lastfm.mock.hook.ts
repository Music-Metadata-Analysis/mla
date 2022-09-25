import { InitialState } from "@src/providers/user/user.initial";

const mockLastFMHook = {
  userProperties: { ...InitialState },
  clear: jest.fn(),
  top20albums: jest.fn(),
  top20artists: jest.fn(),
  top20tracks: jest.fn(),
  ready: jest.fn(),
  playCountByArtist: jest.fn(),
};

export default mockLastFMHook;
