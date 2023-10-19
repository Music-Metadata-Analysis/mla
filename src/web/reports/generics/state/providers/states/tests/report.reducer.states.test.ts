import ReducerAuthUnauthorized from "../auth/auth.unauthorized.class";
import ReducerCacheFailureCreate from "../cache/cache.failure.create.class";
import ReducerCacheFailureRetrieve from "../cache/cache.failure.retrieve.class";
import ReducerCacheStartCreate from "../cache/cache.start.create.class";
import ReducerCacheStartRetrieve from "../cache/cache.start.retrieve.class";
import ReducerCacheSuccessCreate from "../cache/cache.success.create.class";
import ReducerCacheSuccessRetrieve from "../cache/cache.success.retrieve.class";
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
import getReducerState from "../report.reducer.states";
import type ReportReducerStateBaseClass from "../report.reducer.states.base.class";
import type { ReportActionType } from "@src/web/reports/generics/types/state/providers/report.action.types";
import type { ReportStateInterface } from "@src/web/reports/generics/types/state/providers/report.state.types";

describe("getReducerStates", () => {
  let results: Array<
    new (
      state: ReportStateInterface,
      action: ReportActionType
    ) => ReportReducerStateBaseClass<ReportActionType["type"]>
  >;

  beforeEach(() => (results = getReducerState()));

  it("should return the correct list of classes", () => {
    expect(results).toStrictEqual([
      ReducerAuthUnauthorized,
      ReducerCacheFailureCreate,
      ReducerCacheFailureRetrieve,
      ReducerCacheStartCreate,
      ReducerCacheStartRetrieve,
      ReducerCacheSuccessCreate,
      ReducerCacheSuccessRetrieve,
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
