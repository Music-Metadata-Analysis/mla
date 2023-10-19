import ReducerAuthUnauthorized from "./auth/auth.unauthorized.class";
import ReducerCacheFailureCreate from "./cache/cache.failure.create.class";
import ReducerCacheFailureRetrive from "./cache/cache.failure.retrieve.class";
import ReducerCacheStartCreate from "./cache/cache.start.create.class";
import ReducerCacheStartRetrieve from "./cache/cache.start.retrieve.class";
import ReducerCacheSuccessCreate from "./cache/cache.success.create.class";
import ReducerCacheSuccessRetrieve from "./cache/cache.success.retrieve.class";
import ReducerDataPointFailureFetch from "./datapoints/datapoint.failure.class";
import ReducerDataPointNotFoundFetch from "./datapoints/datapoint.notfound.class";
import ReducerDataPointSuccessFetch from "./datapoints/datapoint.success.class";
import ReducerDataPointTimeoutFetch from "./datapoints/datapoint.timeout.class";
import ReducerGenericFailureFetch from "./generics/generic.failure.class";
import ReducerGenericNotFoundFetch from "./generics/generic.notfound.class";
import ReducerGenericRatelimitedFetch from "./generics/generic.ratelimited.class";
import ReducerGenericReadyFetch from "./generics/generic.ready.class";
import ReducerGenericResetFetch from "./generics/generic.reset.class";
import ReducerGenericStartFetch from "./generics/generic.start.class";
import ReducerGenericSuccessFetch from "./generics/generic.success.class";
import ReducerGenericTimeoutFetch from "./generics/generic.timeout.class";

const getReducerStates = () => [
  ReducerAuthUnauthorized,
  ReducerCacheFailureCreate,
  ReducerCacheFailureRetrive,
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
];

export default getReducerStates;
