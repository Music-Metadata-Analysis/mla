import ReportCacheCreateEndpointFactoryV2 from "./methods/v2.report.cache.create.endpoint.factory.class";
import ReportCacheRetrieveEndpointFactoryV2 from "./methods/v2.report.cache.retrieve.endpoint.factory.class";
import APIRouterBase from "@src/api/services/generics/endpoints/generic.router.base.class";
import apiRoutes from "@src/config/apiRoutes";

export const createHandler =
  new ReportCacheCreateEndpointFactoryV2().createHandler();

export const retrieveHandler =
  new ReportCacheRetrieveEndpointFactoryV2().createHandler();

export default class ReportCacheEndpointRouterFactoryV2 extends APIRouterBase {
  public service = "Report Cache";
  public route = apiRoutes.v2.cache;

  public methods = {
    GET: retrieveHandler,
    POST: createHandler,
    PUT: null,
  };
}
