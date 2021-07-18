import { voidDispatch } from "../../utils/voids";
import type {
  UserStateInterface,
  UserContextInterface,
} from "../../types/user.types";

export const InitialState = <UserStateInterface>{
  userName: null,
  integration: null,
  data: {},
  profileUrl: null,
  ratelimited: false,
  ready: false,
  error: false,
};

const InitialContext = <UserContextInterface>{
  userProperties: InitialState,
  dispatch: voidDispatch,
};

export default InitialContext;
