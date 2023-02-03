import ReducerStateBaseClass from "../user.reducer.states.base.class";
import { GenerateUserLink } from "@src/config/lastfm";
import type { UserStateInterface } from "@src/types/user/state.types";

class ReducerGenericReadyFetch extends ReducerStateBaseClass<"ReadyFetch"> {
  type = "ReadyFetch" as const;

  generateState(): UserStateInterface {
    return {
      data: {
        integration: this.action.integration,
        report: this.action.data,
      },
      error: null,
      inProgress: false,
      profileUrl: GenerateUserLink(this.action.userName),
      ready: true,
      retries: this.initialRetries,
      userName: this.action.userName,
    };
  }
}

export default ReducerGenericReadyFetch;
