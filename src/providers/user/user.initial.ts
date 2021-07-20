import { voidDispatch } from "../../utils/voids";
import type { UserContextInterface } from "../../types/user/context.types";
import type { UserStateInterface } from "../../types/user/state.types";

export const InitialState = <UserStateInterface>{
  data: {
    integration: null,
    report: {},
  },
  error: false,
  profileUrl: null,
  ratelimited: false,
  ready: false,
  userName: null,
};

const InitialContext = <UserContextInterface>{
  userProperties: InitialState,
  dispatch: voidDispatch,
};

export default InitialContext;
