import ReducerAuthUnauthorized from "../auth/auth.unauthorized.class";
import ReducerDataPointFailureFetch from "../datapoints/datapoint.failure.class";
import ReducerDataPointNotFoundFetch from "../datapoints/datapoint.notfound.class";
import ReducerDataPointSuccessFetch from "../datapoints/datapoint.success.class";
import ReducerDataPointTimeoutFetch from "../datapoints/datapoint.timeout.class";
import ReducerGenericFailureFetch from "../generics/generic.failure.class";
import ReducerGenericNotFoundFetch from "../generics/generic.notfound.class";
import ReducerGenericRatelimitedFetch from "../generics/generic.ratelimited.class";
import ReducerGenericReadyFetch from "../generics/generic.ready.class";
import ReducerGenericResetFetch from "../generics/generic.reset.class";
import ReducerGenericStartFetch from "../generics/generic.start.class";
import ReducerGenericSuccessFetch from "../generics/generic.success.class";
import ReducerGenericTimeoutFetch from "../generics/generic.timeout.class";
import getReducerState from "../user.reducer.states";
import type ReducerStateBaseClass from "../user.reducer.states.base.class";
import type { UserActionType } from "@src/types/user/action.types";
import type { UserStateInterface } from "@src/types/user/state.types";

describe("getReducerStates", () => {
  let results: Array<
    new (
      state: UserStateInterface,
      action: UserActionType
    ) => ReducerStateBaseClass<UserActionType["type"]>
  >;

  beforeEach(() => (results = getReducerState()));

  it("should return the correct list of classes", () => {
    expect(results).toStrictEqual([
      ReducerAuthUnauthorized,
      ReducerDataPointFailureFetch,
      ReducerDataPointNotFoundFetch,
      ReducerDataPointSuccessFetch,
      ReducerDataPointTimeoutFetch,
      ReducerGenericFailureFetch,
      ReducerGenericNotFoundFetch,
      ReducerGenericRatelimitedFetch,
      ReducerGenericReadyFetch,
      ReducerGenericResetFetch,
      ReducerGenericStartFetch,
      ReducerGenericSuccessFetch,
      ReducerGenericTimeoutFetch,
    ]);
  });
});
