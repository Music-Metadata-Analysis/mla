import { InitialState } from "../../providers/user/user.initial";

const mockLastFMHook = {
  userProperties: { ...InitialState },
  clear: jest.fn(),
  top20albums: jest.fn(),
  ready: jest.fn(),
};

export default mockLastFMHook;
