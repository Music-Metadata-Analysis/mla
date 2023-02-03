import { InitialState } from "@src/web/reports/generics/state/providers/report.initial";

const mockValues = {
  userProperties: { ...InitialState },
  clear: jest.fn(),
  top20albums: jest.fn(),
  top20artists: jest.fn(),
  top20tracks: jest.fn(),
  ready: jest.fn(),
  playCountByArtist: jest.fn(),
};

export default mockValues;
