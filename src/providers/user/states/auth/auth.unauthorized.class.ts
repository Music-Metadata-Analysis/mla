import ReducerStateBaseClass from "../user.reducer.states.base.class";
import type { UserStateInterface } from "@src/types/user/state.types";

class ReducerAuthUnauthorized extends ReducerStateBaseClass<"UnauthorizedFetch"> {
  type = "UnauthorizedFetch" as const;

  generateState(): UserStateInterface {
    return {
      data: {
        integration: this.action.integration,
        report: this.initialReport,
      },
      error: this.action.type,
      inProgress: false,
      profileUrl: null,
      ready: true,
      retries: this.initialRetries,
      userName: this.action.userName,
    };
  }
}

export default ReducerAuthUnauthorized;
