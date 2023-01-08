import requestSettings from "@src/config/requests";
import { voidFn } from "@src/utils/voids";
import type { AggregateBaseReportResponseInterface } from "@src/types/reports/generics/aggregate.types";
import type { UserContextInterface } from "@src/types/user/context.types";
import type { UserStateInterface } from "@src/types/user/state.types";

const InitialAggregateReportState = <
  AggregateBaseReportResponseInterface<unknown>
>{
  status: {
    complete: false,
    steps_total: 0,
    steps_complete: 0,
  },
  created: "",
  content: [],
};

export const InitialState = <UserStateInterface>{
  data: {
    integration: null,
    report: {
      albums: [],
      artists: [],
      playCountByArtist: InitialAggregateReportState,
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
