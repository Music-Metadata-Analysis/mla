import requestSettings from "../../config/requests";
import { voidFn } from "../../utils/voids";
import type { UserContextInterface } from "../../types/user/context.types";
import type { UserStateInterface } from "../../types/user/state.types";

export const InitialState = <UserStateInterface>{
  data: {
    integration: null,
    report: {
      albums: [],
      artists: [],
      tracks: [],
      image: [],
      playcount: 0,
    },
  },
  retries: requestSettings.retries,
  error: null,
  inProgress: false,
  profileUrl: null,
  ready: true,
  userName: null,
};

const InitialContext = <UserContextInterface>{
  userProperties: InitialState,
  dispatch: voidFn,
};

export default InitialContext;
