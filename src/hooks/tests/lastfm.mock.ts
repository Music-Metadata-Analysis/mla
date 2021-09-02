import { InitialState } from "../../providers/user/user.initial";

const mockLastFMHook = {
  userProperties: { ...InitialState },
  top20: jest.fn(),
  clear: jest.fn(),
};

export default mockLastFMHook;
